import Vue from 'vue'
import {
  Button, Input, Form, FormItem, Link, Message, Container, Header, Aside, Dialog, Select, Pagination,
  Main, Footer, Menu, MenuItem, Submenu, MessageBox, Row, Col, Card, Table, TableColumn, Option, Divider
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
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Table)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Divider)
Vue.use(Pagination)
Vue.use(TableColumn)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
