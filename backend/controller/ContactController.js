import Contact from "../models/Contact.js";

export const saveContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const contact = new Contact({
      name,
      email,
      message,
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Contact saved successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
