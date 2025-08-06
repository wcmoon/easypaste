const Paste = require('../models/Paste');
const { generateCode, isValidCustomCode } = require('../utils/codeGenerator');

const createPaste = async (req, res) => {
  try {
    const { content, customCode } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    let code;
    let isCustom = false;

    if (customCode) {
      if (!isValidCustomCode(customCode)) {
        return res.status(400).json({ 
          error: 'Invalid custom code. Use 4-50 characters (letters, numbers, _, -)' 
        });
      }

      const existing = await Paste.findOne({ code: customCode });
      if (existing) {
        return res.status(409).json({ error: 'Custom code already exists' });
      }
      
      code = customCode;
      isCustom = true;
    } else {
      code = generateCode();
    }

    const paste = new Paste({
      code,
      content,
      customCode: isCustom
    });

    await paste.save();

    res.status(201).json({
      code,
      url: `https://easypaste.xyz/${code}`,
      createdAt: paste.createdAt
    });
  } catch (error) {
    console.error('Error creating paste:', error);
    res.status(500).json({ error: 'Failed to create paste' });
  }
};

const getPaste = async (req, res) => {
  try {
    const { code } = req.params;

    const paste = await Paste.findOne({ code });
    
    if (!paste) {
      return res.status(404).json({ error: 'Paste not found' });
    }

    const response = {
      content: paste.content,
      createdAt: paste.createdAt
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching paste:', error);
    res.status(500).json({ error: 'Failed to fetch paste' });
  }
};

module.exports = {
  createPaste,
  getPaste
};