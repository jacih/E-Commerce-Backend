const router = require('express').Router();
const { Product, ProductTag, Tag } = require ('../../models');
const { route } = require('./productRoutes');

// GET Route to read all tags;
router.get('/', async (req, res) => {
  try {
    const data = await Tag.findAll(
    {
      include: [{ model: Product }]
    });
    res.status(200).json(data);
  } catch(err) {
    res.status(500).json(err);
  }
});

// GET Route to find one tag by id;
router.get('/:id', async (req, res) => {
  try {
    const data = await Tag.findByPK(req.params.id,
    {
      include: [{ model: Product }]  
    });  
    if (!data) {
      res.status(404).json({ message: 'No tag found with that id.'}); 
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST Route to create a new tag;
router.post('/', async (req, res) => {
  try {
    const data = await Tag.create(req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT Route to find one tag by id, then update it's name;
router.put('/:id', async (req, res) => {
  try {
    const data = await Tag.update(req.body, {
      where: {
        id: req.params.id
      },
    });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE Route to find one tag by id, then delete it;
router.delete('/:id', async (req, res) => {
  try {
    const data = await Tag.destroy({
      where: {
        id: req.params.id
      }
    })
    res.json(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;