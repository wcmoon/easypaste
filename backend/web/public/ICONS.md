# EasyPaste Icons and Logo

## Design Concept

The EasyPaste logo features a modern clipboard icon with document lines, representing the core functionality of text/code sharing. The design uses:

- **Primary Colors**: Gradient from #667eea (blue) to #764ba2 (purple)
- **Style**: Modern, flat design with subtle shadows
- **Icon Elements**: 
  - Clipboard base (main container)
  - Paper clip (document holder)
  - Document lines (text content)
  - Green checkmark (successful share indicator)

## Files

- `logo.svg` - Main logo with text (200x60px)
- `favicon.svg` - Icon version (32x32px) 
- `favicon.ico` - Legacy favicon format

## Usage

### Web Application
- Header logo: `logo.svg` (responsive sizing)
- Browser tab icon: `favicon.svg` / `favicon.ico`
- Mobile bookmark: Uses `favicon.svg`

### Future Considerations
- App store icons: Export favicon.svg at various sizes (16x16, 32x32, 64x64, 128x128, 256x256, 512x512)
- Social media: Use logo.svg for Open Graph images
- Print materials: SVG format scales to any size

## Technical Notes

All icons are created as SVG for:
- ✅ **Scalability**: Vector format works at any size
- ✅ **Performance**: Small file size, fast loading
- ✅ **Quality**: Crisp at any resolution (Retina displays)
- ✅ **Maintainability**: Easy to modify colors/elements

## Colors Used

```css
Primary Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Success Green: #4CAF50
White: #ffffff (for contrast elements)
```