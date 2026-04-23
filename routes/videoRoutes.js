const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Video = require("../models/Video");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer (store file temporarily)
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Upload Video
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
    });

    const video = await Video.create({
      title: req.body.title,
      url: result.secure_url,
      public_id: result.public_id,
    });

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Videos
router.get("/", async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.json(videos);
});

// Delete Video
router.delete("/:id", async (req, res) => {
  const video = await Video.findById(req.params.id);

  await cloudinary.uploader.destroy(video.public_id, {
    resource_type: "video",
  });

  await video.deleteOne();

  res.json({ message: "Deleted" });
});

module.exports = router;
