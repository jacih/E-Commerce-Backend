const router = require('express').Router();
const { Category, Product, ProductTag, Tag } = require ('../../models');

// GET Route to read all products
router.get('/', async (req, res) => {
  try {
    const data = await Product.findAll(
    {
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name']
        }, 
        { 
          model: Tag,
          attributes: ['id', 'tag_name']
        }
      ]
    });
    res.status(200).json(data);
  } catch(err) {
    res.status(500).json(err);
  }
});

// GET Route to find one product by id
router.get('/:id', async (req, res) => {
  try {
    const data = await Product.findByPK(req.params.id,
      {
        include: [
          { 
            model: Category,
            attributes: ['id', 'category_name']
          }, 
          { 
            model: Tag,
            attributes: ['id', 'tag_name']
          }
        ]  
      });
      if (!data) {
        res.status(404).json({ message: 'No product found with that id.'}); 
      }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST Route to create a new product;
router.post('/', async (req, res) => {
  Product.create(req.body)
    .then((product) => {
      //if there are product tags associated with the new product bulk create product tags related to new product
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
     res.status(200).json(product)
    })
    .then((productTagIds) => 
      res.status(200).json(productTagIds))
    .catch((err) => {
      res.status(400).json(err);
    });
});

// PUT Route to find one product by id, then update the product
  // Will need to update product Tags as well!!
router.put('/:id', async (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    }
  }).then((product) => {
    return ProductTag,findAll(
      {
        where: { product_id: req.params.id }
      });
    })
    .then((productTags) => {
      const productTagIds = productTags.map(( { tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id}) => id);
      
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove }}),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch ((err) => {
      res.status(400).json(err);
    });
});

// DELETE Route to find one product by id, then delete the product
router.delete('/:id', async (req, res) => {
  try {
    const data = await Product.destroy(
      {
        where: {
          id: req.params.id,
        }
      });
    if (!data) {
      res.status(404).json({ message: 'No product with this id'});
    }
  res.status(200).json({ message: `The product, ${req.body.product_name}, has been deleted.`});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;