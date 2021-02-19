<template>
  <transition
    appear
    :enter-active-class="entrance_class"
    leave-active-class="animated fadeOutRight"
  >
    <!-- Todo -->
    <div class="todo">
      <!-- Todo Title -->
      <div class="todo__title q-pl-md q-pr-md" @click="toggleFold('title')" :class="{'todo__title-unfolded': unfolded}">
        <div class="todo__titleleft">
          {{todo.title}}
        </div>
        <div class="todo__titleright">
          <q-checkbox v-model="delete_checkbox" />
        </div>
      </div>
      <!-- Todo Content -->
      <div class="todo__content q-pl-md q-pr-md q-pt-sm q-pb-sm" v-bind:class="{todo__content_unfolded: unfolded}" @click="toggleFold('content')">
        {{content}}
        <q-popup-edit
          v-if="unfolded"
          buttons
          v-model="todo.content"
          @save="saveContent"
          label-set="modifier"
          label-cancel="annuler"
        >
          <q-input
            type="textarea"
            v-model="todo.content"
            autofocus
            counter
            @keyup.enter.stop
          />
        </q-popup-edit>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Todo',
  data () {
    return {
      unfolded: false, // Is the todo folded / unfolded ?
      delete_checkbox: false // Is the todo delete checkbox checked ?
    }
  },
  props: [
    'todo', // object todo (id, title, content)
    'uid', // user id, for backend operations
    'entrance_class' // animation class for apparition. Contains a delay for pretty UX
  ],
  methods: {
    // Fold / unfold Todo content
    toggleFold: function (type) {
      // In case of Todo already unfold and user click on content,
      // we don't want to fold content : we want to edit it
      if (this.unfolded && type === 'content') return
      this.unfolded = !this.unfolded
      if (this.unfolded) {
        // Saving new unfolded Todo id in Store, in order to fold each another Todo that could be unfolded
        this.$store.commit('setTodoIdUnfolded', this.todo.id)
      }
    },
    // Save Todo content to firebase
    saveContent: function () {
      this.db.collection('user').doc(this.uid).collection('todo').doc(this.todo.id).update({
        content: this.todo.content
      })
    }
  },
  watch: {
    // If user check Todo, we delete it in Firebase and remove it in Store list. Delay added for pretty UX
    delete_checkbox: function () {
      if (!this.delete_checkbox) return
      this.db.collection('user').doc(this.uid).collection('todo').doc(this.todo.id).delete().then(() => {
        // Remove in Store list only if Firebase delete was successfull
        setTimeout(() => {
          this.$store.commit('deleteTodo', this.todo.id)
        }, 300)
      })
    },
    // If user unfold another todo, fold this one if it's currently unfolded
    id_unfolded: function () {
      if (this.id_unfolded !== this.todo.id && this.unfolded) {
        this.unfolded = false
      }
    }
  },
  computed: {
    // Displayed content : an excerpt when Todo is folded, or the entire content when Todo is unfolded
    content: function () {
      const stringEnd = this.todo.content.length > 21 ? '...' : ''
      return this.unfolded ? this.todo.content : this.todo.content.substring(0, 20) + stringEnd
    },
    // The id of Todo that user just unfolded
    id_unfolded: function () {
      return this.$store.getters.getTodoIdUnfolded
    }
  }
}
</script>

<style scoped>
.todo {
  width: 90%;
  max-width: 700px;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  cursor: pointer;
}
.todo__title {
  background: #F4F4F4;
  border-radius: 10px 10px 0 0;
  position: relative;
  padding-top: 14px;
  padding-bottom: 14px;
}
.todo__title-unfolded {
  background: #d8e5ec;
}
.todo__title div {
  display: inline-block;
}
.todo__titleleft {
  width: calc(100% - 50px);
}
.todo__titleright {
  width: 50px;
  position: absolute;
  top: 5px;
  right: 0;
}
.todo__content {
  overflow: hidden;
  max-height: 26px;
}
.todo__content_unfolded {
  transition: max-height 0.9s ease-in;
  max-height: 500px;
  border: 2px solid #d8e5ec;
  border-radius: 0 0 10px 10px;
}
</style>
