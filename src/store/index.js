import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
export default new Vuex.Store({
  state: {
    todos: null, // List of todos in Array
    is_connected: false, // Is current visitor logged ?
    is_side_menu_open: false, // is Side menu open ?
    user_uid: null, // If logged, user id saved in Firebase
    initial_login_check: false, // Does Firebase auth performed the initial loggin check ?
    todo_id_unfolded: null // The id of the last Todo that user unfolded (for folding every other Todo eventually unfolded)
  },
  mutations: {
    setTodo (state, payload) {
      state.todos.unshift(payload)
    },
    setTodos (state, payload) {
      state.todos = payload
    },
    setIsConnected (state, payload) {
      state.is_connected = payload
    },
    setSideMenuOpen (state, payload) {
      state.is_side_menu_open = payload
    },
    setUserUid (state, payload) {
      state.user_uid = payload
    },
    setInitialLoginCheck (state, payload) {
      state.initial_login_check = payload
    },
    // From a given Todo id, search the Todo in the state list and delete it.
    deleteTodo (state, payload) {
      if (!state.todos) return
      for (const [i, todo] of state.todos.entries()) {
        if (todo.id === payload) {
          state.todos.splice(i, 1)
          break
        }
      }
    },
    setTodoIdUnfolded (state, payload) {
      state.todo_id_unfolded = payload
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    getTodos: state => state.todos,
    getIsConnected: state => state.is_connected,
    getIsSideMenuOpen: state => state.is_side_menu_open,
    getUserUid: state => state.user_uid,
    getInitialLoginCheck: state => state.initial_login_check,
    getTodoIdUnfolded: state => state.todo_id_unfolded
  }
})
