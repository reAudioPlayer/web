<template>
    <div class="preferences">
        <div class="mobileMenu showIfMobile">
            <span @click="toggleFullSidebar" class="material-symbols-rounded">menu</span>
        </div>
        <full-shelf heading="Themes" :key="themeSelected">
            <theme @selected="updateThemes" v-for="(theme, index) in themes" :key="index"
                :name="theme" />
        </full-shelf>
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
            }
        },
        data() {
            const themes = [
                "night-jade",
                "night-cobalt",
                "night-crimson",
                "night-fire",
                "apollo",
                "gradient",
                "underground",
                "quarantine",
                "extraction",
                "neon",
                "default",
                "royal",
                "ruby",
                "light",
                "light-royal",
                "light-ruby"
            ]
            const themeSelected = window.getCurrentTheme()
            return {
                themes,
                themeSelected
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
</style>
