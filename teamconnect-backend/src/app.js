const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const companyRoutes = require('./routes/companyRoutes');
const roleRoutes = require('./routes/roleRoutes'); 

app.use(express.json());

app.get('/', (req, res) => {
  res.send('O backend do TeamConnect está no ar! 🚀');
});

app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/roles', roleRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});