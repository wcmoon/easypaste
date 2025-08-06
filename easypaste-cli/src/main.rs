use clap::Parser;
use colored::*;
use qrcode::{QrCode, render::unicode};
use reqwest;
use serde::{Deserialize, Serialize};
use std::fs;
use std::io::{self, Read};
use std::path::Path;
use std::process::Command;
use tempfile::NamedTempFile;

#[derive(Parser)]
#[command(name = "easypaste")]
#[command(about = "Share text and code instantly", long_about = None)]
#[command(version)]
#[command(after_help = "EXAMPLES:\n    easypaste file.txt                  # Share a file\n    easypaste \"Hello, World!\"           # Share text directly\n    easypaste -e                        # Open editor to compose\n    echo \"test\" | easypaste             # Share from stdin\n    easypaste --code mycode file.txt    # Use custom share code\n    easypaste --no-qr file.txt          # Don't show QR code")]
struct Cli {
    #[arg(help = "Text to share or file path")]
    input: Option<String>,

    #[arg(short, long, help = "Custom share code (min 4 chars)")]
    code: Option<String>,

    #[arg(short, long, help = "Open editor to compose content")]
    editor: bool,

    #[arg(long, default_value = "http://127.0.0.1:3000", help = "API server URL")]
    server: String,

    #[arg(long, help = "Don't show QR code for the share link")]
    no_qr: bool,
}

#[derive(Serialize)]
struct CreatePasteRequest {
    content: String,
    #[serde(skip_serializing_if = "Option::is_none", rename = "customCode")]
    custom_code: Option<String>,
}

#[derive(Deserialize)]
struct CreatePasteResponse {
    code: String,
    url: String,
}

#[derive(Deserialize)]
struct ErrorResponse {
    error: String,
}

fn get_editor() -> String {
    std::env::var("EDITOR")
        .or_else(|_| std::env::var("VISUAL"))
        .unwrap_or_else(|_| {
            if cfg!(windows) {
                "notepad".to_string()
            } else if cfg!(target_os = "macos") {
                "nano".to_string()
            } else {
                "vi".to_string()
            }
        })
}

fn open_editor() -> Result<String, Box<dyn std::error::Error>> {
    let mut temp_file = NamedTempFile::new()?;

    let editor = get_editor();
    let status = Command::new(&editor)
        .arg(temp_file.path())
        .status()?;

    if !status.success() {
        return Err("Editor exited with non-zero status".into());
    }

    let mut content = String::new();
    temp_file.read_to_string(&mut content)?;

    Ok(content)
}

fn read_content(cli: &Cli) -> Result<String, Box<dyn std::error::Error>> {
    if cli.editor {
        return open_editor();
    }

    match &cli.input {
        Some(input) => {
            let path = Path::new(input);
            if path.exists() && path.is_file() {
                Ok(fs::read_to_string(path)?)
            } else {
                Ok(input.clone())
            }
        }
        None => {
            if atty::is(atty::Stream::Stdin) {
                return open_editor();
            }

            let mut buffer = String::new();
            io::stdin().read_to_string(&mut buffer)?;
            Ok(buffer)
        }
    }
}

fn validate_custom_code(code: &str) -> Result<(), String> {
    if code.len() < 4 {
        return Err("Custom code must be at least 4 characters long".to_string());
    }
    if code.len() > 50 {
        return Err("Custom code must be at most 50 characters long".to_string());
    }
    if !code.chars().all(|c| c.is_alphanumeric() || c == '_' || c == '-') {
        return Err("Custom code can only contain letters, numbers, underscore and hyphen".to_string());
    }
    Ok(())
}

fn create_paste(
    content: String,
    custom_code: Option<String>,
    server: &str,
) -> Result<CreatePasteResponse, Box<dyn std::error::Error>> {
    // Validate custom code if provided
    if let Some(ref code) = custom_code {
        validate_custom_code(code)?;
    }

    let client = reqwest::blocking::Client::new();
    let api_url = if server.contains("://") {
        format!("{}/api/paste", server)
    } else {
        format!("https://{}/api/paste", server)
    };

    let request = CreatePasteRequest {
        content,
        custom_code,
    };

    let response = client
        .post(&api_url)
        .json(&request)
        .send()?;

    if response.status().is_success() {
        Ok(response.json()?)
    } else {
        let error: ErrorResponse = response.json()?;
        Err(error.error.into())
    }
}

fn generate_qr_code(url: &str) -> Option<String> {
    match QrCode::new(url) {
        Ok(code) => {
            let image = code.render::<unicode::Dense1x2>()
                .dark_color(unicode::Dense1x2::Light)
                .light_color(unicode::Dense1x2::Dark)
                .build();
            Some(image)
        }
        Err(_) => None,
    }
}

fn main() {
    let cli = Cli::parse();

    let content = match read_content(&cli) {
        Ok(c) => c,
        Err(e) => {
            eprintln!("{} {}", "Error:".red().bold(), e);
            std::process::exit(1);
        }
    };

    if content.trim().is_empty() {
        eprintln!("{} No content to share", "Error:".red().bold());
        std::process::exit(1);
    }

    println!("{}", "Creating paste...".cyan());

    match create_paste(content, cli.code, &cli.server) {
        Ok(response) => {
            println!("\n{}", "✓ Paste created successfully!".green().bold());
            println!("\n{}: {}", "Share URL".bold(), response.url.bright_blue());
            println!("{}: {}", "Share Code".bold(), response.code.bright_yellow());

            // Show QR code by default unless --no-qr flag is used
            if !cli.no_qr {
                if let Some(qr_code) = generate_qr_code(&response.url) {
                    println!("\n{}", "QR Code:".bold());
                    println!("{}", qr_code);
                }
            }

            if let Ok(_) = Command::new("which").arg("pbcopy").output() {
                let _ = Command::new("sh")
                    .arg("-c")
                    .arg(format!("echo -n '{}' | pbcopy", response.url))
                    .output();
                println!("\n{}", "URL copied to clipboard!".green());
            }
        }
        Err(e) => {
            eprintln!("{} {}", "Error:".red().bold(), e);
            std::process::exit(1);
        }
    }
}
