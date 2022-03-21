const router = require('express').Router();
const { Category, Product } = require ('../../models');

// GET Route to read all categories
  // will need to include products within each!
router.get('/', async (req, res) => {
  try {
    const data = await Category.findAll(
    {
      include: [{ model: Product }]
    });
    res.status(200).json(data);
  } catch(err) {
    res.status(500).json(err);
  }
});

// GET Route to find one category by id
  // Will need to include the category's products
router.get('/:id', async (req, res) => {
  try {
    const data = await Category.findByPk(req.params.id,
    {
      include: [{ model: Product }]  
    });
    if (!data) {
      res.status(404).json({ message: 'No category with that id.'});
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST Route to create a new category
router.post('/', async (req, res) => {
  try {
    const data = await Category.create(req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT Route to find a category by id, then update
router.put('/:id', async (req, res) => {
  try {
    const data = await Category.update(req.body,
    {
      where: {
        id: req.params.id,
      }
    });
    if (!data) {
      res.status(404).json({ message: 'No category with that id.'});
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE Route to find a category by id, then delete
router.delete('/:id', async (req, res) => {
  try {
    const data = await Category.destroy(
    {
      where: {
        id: req.params.id,
      }
    });
    if (!data) {
      res.status(404).json({ message: 'No category with that id.'});
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;