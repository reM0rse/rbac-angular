const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
server.use(middlewares)
server.use(jsonServer.bodyParser)

server.post('/login', (req, res) => {
  const { username, password } = req.body
  const db = router.db // lowdb instance
  const user = db.get('users').find({ username, password }).value()

  if (user) {
    const role = db.get('roles').find({ id: user.roleId }).value()
    const permissions = db.get('permissions').filter(p => role.permissionIds.includes(p.id)).value()
    res.jsonp({
      id: user.id,
      username: user.username,
      role: role.name,
      permissions: permissions.map(p => p.name)
    })
  } else {
    res.status(401).jsonp({ error: 'Invalid credentials' })
  }
})

server.post('/register', (req, res) => {
  const { username, password, roleId } = req.body
  const db = router.db
  const exists = db.get('users').find({ username }).value()

  if (exists) {
    res.status(400).jsonp({ error: 'User already exists' })
  } else {
    const newUser = {
      id: Date.now(),
      username,
      password,
      roleId
    }
    db.get('users').push(newUser).write()
    res.status(201).jsonp(newUser)
  }
})

server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running on port 3000')
})