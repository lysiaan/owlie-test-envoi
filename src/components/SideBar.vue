<template>
  <div class="container">
    <!-- loader (backend operations running) -->
    <div v-if="loading" class="loading q-pa-md flex flex-center">
      <q-circular-progress
        indeterminate
        size="50px"
        color="primary"
        class="q-ma-md"
      />
    </div>
    <!-- User currently logged -->
    <div v-if="connected_user">
      <h1 class="q-mt-sm q-mb-sm">Bonjour {{connected_user.email}} !</h1>
      <q-btn @click="disconnect" label="me déconnecter" color="secondary"/>
    </div>
    <!-- Visitor not logged -->
    <div v-else>
      <h1 class="q-mt-sm q-mb-sm">Me connecter</h1>
      <div class="q-pb-sm">Entrez vos identifiants pour vous connecter</div>
      <!-- login Form -->
      <q-form
        class="q-gutter-md"
      >
        <q-input
          filled
          v-model="input_email"
          label="Email"
        />
        <q-input
          filled
          v-model="input_password"
          label="Mot de passe"
          :type="hidden_password ? 'password' : 'text'"
        >
          <template v-slot:append>
            <q-icon
              :name="hidden_password ? 'fas fa-eye-slash' : 'fas fa-eye'"
              :size="'xs'"
              class="cursor-pointer"
              @click="hidden_password = !hidden_password"
            />
          </template>
        </q-input>
        <div>
          <q-btn @click="connect" :disable="!btns_enabled" label="me connecter" color="secondary" class="q-mb-sm q-mt-md"/>
          <br>
          <div @click="create" class="q-ml-sm q-pt-sm q-pb-sm btn-create uppercase" :class="{'disabled': !btns_enabled}">créer un compte</div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideBar',
  data () {
    return {
      input_email: '', // attached to form input : email
      input_password: '', // attached to form input : password
      hidden_password: true, // are password characters visible or marked as dots ?
      connected_user: null, // if a user is logged, take user object from firebase. Else null
      loading: false // spinner in order to inform that action is performing (backend calls)
    }
  },
  mounted () {
    // Tracks user auth status at startup and at every changes
    this.auth.onAuthStateChanged(user => {
      this.connected_user = user
      this.$store.commit('setIsConnected', true)
      // Actions performed when unlogged visitor becomes logged user
      if (user) {
        // Close side menu if open
        if (this.$store.getters.getIsSideMenuOpen) {
          this.$store.commit('setSideMenuOpen', false)
        }
        // Save User uid in store (for fetch, insert, update and delete Todos)
        this.$store.commit('setUserUid', user.uid)
        // Populate todo list in store
        const todos = []
        this.db.collection('user').doc(user.uid).collection('todo').get().then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            const obj = doc.data()
            obj.id = doc.id
            todos.push(obj)
          })
          // Todos array order by creation date
          todos.sort((a, b) => b.created_at - a.created_at)
          this.$store.commit('setTodos', todos)
        })
      } else {
        this.$store.commit('setTodos', null)
        this.$store.commit('setIsConnected', false)
      }
      // Inputs emptying
      this.input_email = ''
      this.input_password = ''
      // Saving in store that the check of login at application startup is done
      // (show a loader instead of authenticate button in main page if this initial check not yet performed)
      if (!this.$store.getters.getInitialLoginCheck) {
        this.$store.commit('setInitialLoginCheck', true)
      }
    })
  },
  computed: {
    // Form buttons are clickable only if something is typed in inputs
    btns_enabled: function () {
      return this.input_password && this.input_password.length > 0 && this.input_email && this.input_email.length > 0
    }
  },
  methods: {
    // Try to connect a user to firebase auth from email / password
    connect: function () {
      this.loading = true
      this.auth.signInWithEmailAndPassword(this.input_email, this.input_password).then(cred => {
      }).catch(e => {
        console.log('Erreur lors de la tentative de connexion (non géré pour ce test) :', e.message)
      }).finally(() => {
        this.loading = false
      })
    },
    // Disconnect user from firebase auth
    disconnect: function () {
      this.loading = true
      this.auth.signOut().then(() => {
        this.connected_user = null
        this.$store.commit('setUserUid', null)
        this.loading = false
      })
    },
    // Try to create and connect a user to firebase auth from email / password
    create: function () {
      if (!this.btns_enabled) return
      this.loading = true
      this.auth.createUserWithEmailAndPassword(this.input_email, this.input_password).then(cred => {
      }).catch(e => {
        console.log('Erreur lors de la tentative de création de compte (non géré pour ce test) :', e.message)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 1.1rem;
  font-weight: bold;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  z-index: 99;
}
.container {
  width: 87%;
  position: relative;
  margin-left: auto;
  margin-right: auto;
}
.btn-create {
  display: inline-block;
}
.btn-create:hover {
  text-decoration: underline;
  cursor: pointer;
}
.disabled {
  color: #b6b6b6;
}
.uppercase {
  text-transform: uppercase;
}
</style>
