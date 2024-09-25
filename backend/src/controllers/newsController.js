const News = require('../models/News');
const User = require('../models/User');
const { sendNewsEmail } = require('../utils/email');
const { sendNewsWhatsApp } = require('../utils/whatsapp');


exports.createNews = async (req, res) => {
    try {
        const news = new News(req.body);
        await news.save();

        // Find all users who have accepted to receive news
        const usersToNotify = await User.find({ receiveNews: true });
        // Send Email
        usersToNotify.forEach(async (user) => {
            if (user.email) {
                await sendNewsEmail(user.email, news.title, news.description, news.image);
            }
        });

        res.status(201).json(news);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getNews = async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 })
        res.status(200).json(news);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await News.findById(id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(200).json(news);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await News.findByIdAndUpdate(id, req.body, { new: true });
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(200).json(news);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        await News.findByIdAndDelete(id);
        res.status(200).json({ message: 'News deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
