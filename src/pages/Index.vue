<template>
  <q-page class="flex">
    <!-- Loader when we inserting new Todo to backend -->
    <div class="add-loading" v-if="add_loading">
      <q-circular-progress indeterminate size="50px" color="primary" class="q-ma-md q-mt-xl loader"/>
    </div>
    <!-- Loader when initial Firebase auth not yet checked -->
    <div v-if="disconnected === null" class="container flex justify-center">
      <q-circular-progress indeterminate size="50px" color="primary" class="q-ma-md q-mt-xl loader"/>
    </div>
    <!-- Initial Firebase auth checked -->
    <div v-else class="container">
      <!-- Visitor not logged -->
      <div class="container container-auth q-pl-md q-pr-md q-pt-xl" v-if="disconnected">
        <div>
          <p>Afin d'accéder à votre Todolist, merci de bien vouloir vous authentifier.</p>
        </div>
        <div>
          <q-btn @click="openSideMenu" label="m'authentifier" color="secondary" class="q-mb-sm q-mt-md"/>
        </div>
      </div>
      <!-- Visitor logged -->
      <div v-else>
        <!-- Pop-up for adding new Todo -->
        <div class="cursor-pointer adding-area">
          <transition appear enter-active-class="animated zoomIn">
            <q-btn @click="test" round color="secondary" icon="fas fa-plus" class="btn-add q-ml-md" padding="12px" />
          </transition>
          <q-popup-edit @save="add" v-model="new_todo_title" buttons label-set="ajouter" label-cancel="annuler">
            <q-input v-model="new_todo_title" dense autofocus counter />
          </q-popup-edit>
        </div>
        <!-- Loader when Todos fetch not yet performed -->
        <div v-if="todos === null" class="flex">
          <q-circular-progress indeterminate size="50px" color="primary" class="q-ma-md loader"/>
        </div>
        <!-- Todos fetch performed -->
        <div v-else class="q-pt-xl">
          <!-- At least one Todo in the list -->
          <div v-if="todos.length > 0">
            <Todo v-for="(todo, i) in todos" :key="todo.id" class="todo q-mb-lg" :todo="todo"
                  :uid="uid" :delay="i" :entrance_class="'animated fadeInLeft delay-'+i+'s'"/>
          </div>
          <!-- No Todo in the list -->
          <div v-else class="container container-center">
            Aucune tâche enregistrée
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import Todo from 'components/Todo.vue'
export default {
  name: 'PageIndex',
  components: { Todo },
  data () {
    return {
      disconnected: null, // Is visitor currently not logged ? if null, first Firebase auth check not yet performed
      new_todo_title: '', // Title typed by user when he's creating new Todo
      add_loading: false // Is the loader during new Todo insertion visible ?
    }
  },
  computed: {
    // List of todos related to current logged user. Initial value is NULL
    todos: function () {
      return this.$store.getters.getTodos
    },
    // Get current visitor status (connected / disconnected) from Store. Initial value is FALSE
    is_connected: function () {
      return this.$store.getters.getIsConnected
    },
    // Get state of initial auth check (Firebase auth) from Store. Initial value is FALSE
    initial_login_check: function () {
      return this.$store.getters.getInitialLoginCheck
    },
    // Get User id (if connected) from Store. Initial value is NULL
    uid: function () {
      return this.$store.getters.getUserUid
    }
  },
  methods: {
    // If side menu not already open, set the new status of side menu (open) in store
    openSideMenu: function () {
      if (!this.$store.getters.getIsSideMenuOpen) {
        this.$store.commit('setSideMenuOpen', true)
      }
    },
    // Set the local status of current visitor from Store variables (connected or not).
    // Get a result only if Firebase performed the initial check (at application start)
    checkIfConnected: function () {
      this.disconnected = !this.is_connected && this.initial_login_check
    },
    // Build a Todo object from user input, save it in Firebase and add it at the beginning of Store Todos list
    test: function () {
    },
    // Insert a new Todo in firebase, and add this new Todo at the beginning of Todos list in Store
    add: function () {
      this.add_loading = true
      const newTodo = {
        title: this.new_todo_title,
        content: 'Aucune description',
        created_at: Date.now()
      }
      this.db.collection('user').doc(this.uid).collection('todo').add(newTodo).then((docRef) => {
        // adding id recovered after insert
        newTodo.id = docRef.id
        this.$store.commit('setTodo', newTodo)
        this.new_todo_title = ''
      }).catch(e => {
        console.error("Echec de la tentative d'ajout de la nouve tâche (non géré pour ce test) : " + e.message)
      }).finally(() => {
        this.add_loading = false
      })
    }
  },
  watch: {
    // Try to set local variable for connection status when connection status changes in Store
    is_connected: function () {
      this.checkIfConnected()
    },
    // Try to set local variable for connection status when initial connection check (Firebase auth) is performed
    initial_login_check: function () {
      this.checkIfConnected()
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
}
.container-center {
  text-align: center;
}
.container-auth div {
  text-align: center;
}
.container-auth p {
  font-size: 0.85rem;
  color: #5f5f5f;
}
.btn-add {
  position: fixed;
  transform: translateY(-24px);
  z-index: 95;
}
.loader {
  position: relative;
  margin-left: auto;
  margin-right: auto;
  width: 100px;
}
.add-loading {
  height: 100%;
  width: 100%;
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  z-index: 99;
}
.adding-area {
  width: 100%;
  max-width: 600px;
}
</style>
