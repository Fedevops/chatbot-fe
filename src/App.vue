<template>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <div class="overlay" v-if="showForm"></div>
  <!-- Modal de login -->
  <!-- <div>
    <button @click="isModalOpen = true">Show Modal</button>
    <Modal v-model:visible="isModalOpen" @update:visible="isModalOpen = false">
      <template #header>
        <h2>Login</h2>
      </template>
      <fb:login-button 
        scope="public_profile,email"
        @login="checkLoginState">
      </fb:login-button>
      <button @click="loginWithGoogle">Login com Google</button>
    </Modal>
  </div> -->
  <div id="app">
    <!-- Menu inicial onde tem dois botões: Chat ou cadastrar novas perguntas -->
    <div class="menu">
        <button class="btn-primary">Conversar com o Chatbot</button>
        <button class="btn-secondary" @click="toggleForm">Registrar Nova Pergunta</button>
        <!-- <button class="btn-secondary" @click="toggleForm">Login</button> -->
    </div>
    <!-- Modal onde você pode conversar com o bot -->
    <div class="chat-container">
      <div class="messages" ref="messageBox">
        <div v-for="msg in messages" :key="msg.id" :class="`message ${msg.type}`">
          <span v-if="msg.type === 'bot'">🤖 diz: &nbsp;<br></span> {{ msg.text }}
        </div>
      </div>
      <div class="input-container">
        <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Digite sua mensagem..." />
        <button @click="sendMessage">Enviar</button>
      </div>
      <div class="exit-label"> Escreva "sair" para abandonar o chat...</div>
      <!-- Modal onde posso cadastrar novas perguntas -->
      <div class="form-container" v-if="showForm">
        <h2>Registrar Nova Pergunta</h2>
        <form @submit.prevent="handleSubmit">
            <div class="field">
                <label for="question">Pergunta:</label>
                <input type="text" v-model="question" id="question" name="question" required>
            </div>
            <div class="field">
                <label for="answer">Resposta:</label>
                <input type="text" v-model="answer" id="answer" name="answer" required>
            </div>
            <div class="field">
                <button type="submit" class="btn-primary">Adicionar</button>
                <button type="button" class="btn-cancel" @click="cancelForm">Cancelar</button>
            </div>
        </form>
      </div>
    </div>
  </div>
  <footer>
      by Fernando Silva 2023
  </footer>
</template>

<script>
export default {
  data() {
    return {
        userInput: '',
        messages: [],
        showForm: false,
        question: '',
        answer: '',
        isModalOpen: false
    };
  },

  methods: {
    async sendMessage() {
      if (!this.userInput) return;
      
      this.messages.push({ id: Date.now(), text: this.userInput, type: 'user' });
      console.log(this.messages)
      const response = await fetch('http://127.0.0.1:5000/pergunta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: this.userInput })
      });
      const data = await response.json();
      console.log(data)
      this.messages.push({ id: Date.now() + 1, text: data.response, type: 'bot' });
      this.scrollToBottom();
      
      this.userInput = '';
    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
    async handleSubmit() {
      try {
          const requestData = {
              question: this.question,
              answer: this.answer
          };

          const response = await fetch('http://127.0.0.1:5000/add', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestData)
          });

          if (!response.ok) {
              throw new Error('Erro ao enviar os dados');
          }

          const responseData = await response.json();
          console.log(responseData);
          this.showForm = false; // Opcional: fechar o formulário após a submissão

      } catch (error) {
          console.error("Erro:", error);
      }
    },
    loginWithFacebook() {
      // Implementação do login com Facebook
    },
    loginWithGoogle() {
      // Implementação do login com Google
    },
    cancelForm() {
        this.showForm = false;  // Isso irá esconder o formulário
    },
    mounted() {
    this.sendMessage('Olá, seja bem vindo, em que posso ajudar você hoje?'); 
    },
    // checkLoginState() {
    //   FB.getLoginStatus(response => {
    //     if (response.status === 'connected') {
    //       // O usuário está logado e autenticado
    //       // Você pode, por exemplo, guardar o token de acesso e obter informações do usuário
    //       this.getUserInfo(response.authResponse.accessToken);
    //     } else {
    //       // O usuário não está logado no Facebook ou não deu permissão
    //     }
    //   });
    // },
    // getUserInfo(accessToken) {
    //   FB.api('/me', {fields: 'id,name,email'}, response => {
    //     console.log(response);
    //     // Faça algo com as informações do usuário, por exemplo, guardar no vuex ou local storage
    //   });
    scrollToBottom() {
        this.$nextTick(() => {
            if (this.$refs.messageBox) {
                const box = this.$refs.messageBox;
                box.scrollTop = box.scrollHeight;
            }
        });
    }
  }
}
</script>



<style scoped>

body, html {
    font-family: Arial, sans-serif;
    color: #f0f0f0;  /* Cor de texto clara para contraste */
    body, html {
    background-color: #1a1a1d !important;
}
}

footer {
    padding: 20px 0;
    text-align: center;
    background-color: #1a1a1d;
    color: #f0f0f0;
    position: fixed;
    bottom: 0;
    width: 100%;
    font-size: 0.9em;
}
.exit-label {
  font-family: 'Roboto', sans-serif;
  color: grey;
  font-size: 10px;
}
.chat-container {
  max-width: 400px;
  margin: 40px auto;
  border: 1px solid #444;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.messages {
  max-height: 400px;
  overflow-y: auto;
  font-family: 'Roboto', sans-serif;
  color: grey;
  font-size: 13px;
}

.message {
  padding: 10px;
  margin: 5px 0;
  border-radius: 8px;
}


.message.user {
  align-self: flex-end;
  background-color: #333;
}

.message.bot {
  color: white;
  background-color: #555;

}

.input-container {
  display: flex;
  margin-top: 10px;
}

input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 4px 0 0 4px;
  background-color: #333;
  color: #f0f0f0;
}

button {
  padding: 10px 15px;
  border: none;
  background-color: #555;
  color: #f0f0f0;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
}

.menu {
  background-color: #222;
  padding: 20px 40px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  gap: 20px;
}

.menu button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  background-color: #555;
  color: #f0f0f0;
}

.menu button:hover {
    background-color: #777;
    transform: scale(1.05);
}

.form-container {
    font-family: 'Roboto', sans-serif;
    width: 400px;
    background-color: #ffffff;
    padding: 20px 40px;
    margin-top: 20px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    z-index: 2000; 
    position: relative;
}

.field {
    margin-bottom: 20px;
}

.field label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #545252;
}

.field_input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-family: 'Roboto', sans-serif;
}

.field button {
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
    font-family: 'Roboto', sans-serif;
    font-weight: 700; /* bold */
    cursor: pointer;
    background-color: #555;
}
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Preto semi-transparente */
    z-index: 1000; /* Certifique-se de que o z-index seja suficientemente alto para cobrir outros elementos */
}
.btn-cancel {
    background-color: red;
    color: #ffffff;
    border: 1px solid #ccc;
    padding: 10px 15px;
    margin-left: 10px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
}

.btn-cancel:hover {
    background-color: #ffffff;
    color: gray
}

.message {
  padding: 12px 16px;
  margin: 10px;
  border-radius: 15px;
  max-width: 80%;
}

.message.user {
  background-color: #E9E9E9;
  align-self: flex-end;
  border-bottom-right-radius: 3px;
}

.message.bot {
  background-color: #4CAF50;
  color: white;
  align-self: flex-start;
  border-bottom-left-radius: 3px;
  display: flex;
  align-items: center;  /* Alinhar verticalmente o texto e o emoji */
}

</style>
