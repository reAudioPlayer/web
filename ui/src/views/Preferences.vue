<template>
    <div class="preferences">
        <div class="spotify">
            <h2>Spotify</h2>
            <details>
                <summary>How to</summary>
            <p>1) Head over to the <a @click="() => redirect('https://developer.spotify.com/dashboard/applications')">spotify developer dashboard</a></p>
            <p>2) Create An App</p>
            <p>3) Enter any name and any description</p>
            <p>4) Edit the settings: set the redirect url to <a href="https://eu-apollo.herokuapp.com/collection/releases">https://eu-apollo.herokuapp.com/collection/releases</a></p>
            <p>5) Copy and enter the client id and secret into the corresponding input field</p>
            </details>
            <div class="wrapTogether">
                <p>Client ID: </p><input type="text" v-model="spotifyClientId" />
            </div>
            <div class="wrapTogether">
                <p>Client Secret: </p><input type="text" v-model="spotifyClientSecret" />
            </div>
            <div class="wrapTogether spaceBetween">
                <button @click="saveSpotify">save</button>
            </div>
        </div>
        <div>
            <h2>Themes</h2>
            <div class="mobileMenu showIfMobile">
                <span @click="toggleFullSidebar" class="material-symbols-rounded">menu</span>
            </div>
            <full-shelf heading="" :key="themeSelected">
                <theme @selected="updateThemes" v-for="(theme, index) in themes" :key="index"
                    :name="theme" />
            </full-shelf>
        </div>
    </div>
</template>

<script>
    import FullShelf from "../components/catalogue/FullShelf.vue"
    import Theme from "../components/preferences/Theme.vue"
    export default {
    components: { Theme, FullShelf },
        name: "Preferences",
        methods: {
            updateThemes() {
                this.themeSelected = window.getCurrentTheme()
            },
            toggleFullSidebar()
            {
                this.$emit("toggleFullSidebar")
            },
            saveSpotify()
            {
                if (!this.userData.tokens)
                {
                    this.userData.tokens = { }
                }
                this.userData.tokens.spotifyApiId = this.spotifyClientId;
                this.userData.tokens.spotifyApiSecret = this.spotifyClientSecret;

                fetch("/user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.userData.data)
                }).then(x => {
                    console.log(x)
                    this.$emit("close")
                })
            }
        },
        props: {
            userData: Object
        },
        watch: {
            userData() {
                this.spotifyClientId = this.userData?.tokens?.spotifyApiId
                this.spotifyClientSecret = this.userData?.tokens?.spotifyApiSecret
            }
        },
        data() {
            const themes = [
                "night-jade",
                "neon",
                "default",
                "light",
            ]
            const themeSelected = window.getCurrentTheme()
            console.log(this.userData)
            return {
                themes,
                themeSelected,
                spotifyClientId: this.userData?.tokens?.spotifyApiId,
                spotifyClientSecret: this.userData?.tokens?.spotifyApiSecret
            }
        }
    }
</script>

<style scoped>
    .mobileMenu {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .preferences, .padding-20 {
        padding: 20px;
    }

    .padding-10 {
        padding: 10px;
    }

    h2 {
        font-size: 1.5em;
    }

    p {
        margin: 0;
    }

    button {
        color: var(--font-contrast);
        background-color: var(--font-colour);
        border: none;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 10px 20px;
        font-family: var(--font-family);
        font-weight: bold;
    }

    button:hover {
        cursor: pointer;
    }

    .restrictedMode {
        color: white;
        background-color: #c73c3c;
        margin-left: 20px;
    }

    input[type="checkbox"] {
        color: var(--font-contrast);
        background-color: var(--font-colour);   
    }

    input[type="checkbox"]:checked {
        color: var(--accent);
        background-color: var(--accent);
    }

    input[type="text"] {
        margin-bottom: 20px;
        border-radius: 40px;
        border: none;
        padding: 5px;
        font-family: var(--font-family);
        width: 20vw;
        color: var(--font-contrast);
        background-color: var(--font-colour);
    }
</style>

<style scoped>
.checkbox {
  width: 100%;
  margin: 15px auto;
  position: relative;
  display: block;
}
.checkbox label {
  position: relative;
  min-height: 34px;
  display: block;
  padding-left: 40px;
  margin-bottom: 0;
  font-weight: normal;
  cursor: pointer;
}
.checkbox label span {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.checkbox label:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  margin: 4px;
  width: 22px;
  height: 22px;
  transition: transform 0.28s ease;
  border-radius: 3px;
  border: 2px solid var(--font-colour);
  transition: border ease 0.25s;
}
.checkbox label:after {
  content: "";
  display: block;
  width: 10px;
  height: 5px;
  border-bottom: 2px solid var(--accent);
  border-left: 2px solid var(--accent);
  transform: rotate(-45deg) scale(0);
  transition: transform ease 0.25s;
  position: absolute;
  top: 12px;
  left: 10px;
}
.checkbox input[type=checkbox] {
  width: auto;
  opacity: 1e-8;
  position: absolute;
  left: 0;
  margin-left: -20px;
}
.checkbox input[type=checkbox]:checked ~ label:before {
  border: 2px solid var(--accent);
  transition: border ease 0.25s;
}
.checkbox input[type=checkbox]:checked ~ label:after {
  transform: rotate(-45deg) scale(1);
}
.checkbox input[type=checkbox]:focus + label::before {
  outline: 0;
}

a {
    color: var(--font-colour);
}
</style>
