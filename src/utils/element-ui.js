import Vue from 'vue'
import {
  Button, Input, Form, FormItem, Link, Message, Container, Header, Aside,
  Main, Footer, Menu, MenuItem, Submenu, MessageBox
} from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Link)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
