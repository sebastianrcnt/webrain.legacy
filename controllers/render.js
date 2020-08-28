const render = (template) => (req, res) => {
  res.render(template, req.context);
};

module.exports = render;
