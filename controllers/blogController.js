const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  try {
    const { title, description, tags, body } = req.body;

    
    const words = body.split(' ').length;
    const readingTime = Math.ceil(words / 200) + ' min';

    const blog = new Blog({
      title,
      description,
      tags,
      body,
      author: req.user._id,
      reading_time: readingTime,
    });

    await blog.save();
    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.listBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, sort, state } = req.query;
    const query = { state: 'published' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    if (state) {
      query.state = state;
    }

    const blogs = await Blog.find(query)
      .sort({ [sort || 'timestamp']: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalBlogs = await Blog.countDocuments(query);

    res.status(200).json({
      total: totalBlogs,
      page: parseInt(page),
      limit: parseInt(limit),
      blogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'first_name last_name email');
    if (!blog || blog.state !== 'published') {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.read_count += 1;
    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(blog, req.body);
    await blog.save();

    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await blog.remove();
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};