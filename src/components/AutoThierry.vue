<template>
  <v-stage ref="stage" :config="stageSize">
    <v-layer ref="layer">
      <v-image :config="configThierry" />
      <v-image v-if="img2" :config="configOther" />
      <v-text :config="configText" />
    </v-layer>
  </v-stage>
  <vue-bottom-sheet ref="myBottomSheet" :max-height="pageHeight">
    <div class="sheet-content">
      <h1>Image</h1>
      <button class="select-picture">
        <span>Selectionner une image</span>
        <input
          ref="uploadInput"
          type="file"
          accept="image/jpg, image/jpeg, image/png, image/gif"
          @change="selectFile"
        />
      </button>
      <VuePictureCropper
        :boxStyle="{
          width: '100%',
          height: '30vh',
          backgroundColor: '#f8f8f8',
          margin: 'auto',
        }"
        :img="pic"
        :options="{
          viewMode: 1,
          dragMode: 'crop',
          aspectRatio: 1,
        }"
      />
      <h1>Texte</h1>
      <p>Ça commence automatiquement par "Aujourd'hui il te ramène ".</p>
      <textarea name="text" id="text" rows="10" @input="updateText"></textarea>
      <button class="select-picture" @click="closeBottomSheet">
        <span>Valider</span>
      </button>
    </div>
  </vue-bottom-sheet>
  <button class="fab" @click="openBottomSheet()">
    <span class="material-symbols-outlined">&#xe3c9;</span>
  </button>
  <button class="fab-save" @click="exportThierry()">
    <span class="material-symbols-outlined">&#xf090;</span>
  </button>
  <a
    class="fab-bluesky"
    target="_blank"
    title="Share on Bluesky"
    :href="'https://bsky.app/intent/compose?text=Check%20moi%20donc%20ce%20générateur%20de%20Thierry%20de%20fou.%20https://thierry.pornhub.alsace/'"
  >
    <svg
      width="1em"
      height="1em"
      fill="#fff"
      viewBox="0 0 600 530"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z"
      />
    </svg>
  </a>
</template>

<script lang="ts">
import { default as blsky } from '@/assets/blsky.png'
import { default as img } from '@/assets/thierry-base.png'
import { getCrop } from '@/core/helpers'
// @ts-expect-error: missing types
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import type { Stage } from 'konva/lib/Stage'
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
// import img2 from '@/assets/tintin.png'
interface ThierryData {
  pic: string
  pageHeight: number
  stageSize: {
    width: number
    height: number
  }
  configThierry: {
    image?: HTMLImageElement
    x?: number
    y?: number
    width?: number
    height?: number
    name?: string
  }
  configOther: {
    image?: HTMLImageElement
    x?: number
    y?: number
    width?: number
    height?: number
    name?: string
  }
  configText: {
    direction?: string
    fontFamily?: string
    fontSize?: number
    text?: string
    align?: string
    lineHeight?: number
    fill?: string
    x?: number
    y?: number
    width?: number
    height?: number
  }
  blsky: string
  img?: HTMLImageElement
  img2?: HTMLImageElement
  imgWidth?: number
  imgHeight?: number
}
export default {
  components: {
    VueBottomSheet,
    VuePictureCropper,
  },
  props: {
    path: String,
  },
  data(): ThierryData {
    return {
      pic: '',
      pageHeight: window.innerHeight,
      stageSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      configThierry: {
        image: undefined,
        x: undefined,
        y: undefined,
        width: undefined,
        height: undefined,
        name: undefined,
      },
      configOther: {
        image: undefined,
        x: undefined,
        y: undefined,
        width: undefined,
        height: undefined,
        name: undefined,
      },
      configText: {
        direction: 'ltr',
        fontFamily: 'arial',
        fontSize: 18,
        text: "Aujourd'hui il te ramène ",
        align: 'left',
        lineHeight: 1.2,
        fill: '#fff',
        x: 170,
        y: 1251,
        width: 810,
        height: 280,
      },
      blsky,
      img: undefined,
      img2: undefined,
      imgWidth: undefined,
      imgHeight: undefined,
    }
  },
  created() {
    const image = new window.Image()
    image.src = img
    image.onload = () => {
      this.img = image
      this.imgWidth = image.width
      this.imgHeight = image.height
      this.onResize()
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    /**
     * Select the picture to be cropped
     */
    selectFile(e: Event) {
      // Get selected files
      const { files } = e.target as HTMLInputElement
      if (!files || !files.length) return

      // Convert to dataURL and pass to the cropper component
      const file = files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // Update the picture source of the `img` prop
        this.pic = String(reader.result)
        // Clear selected files of input element
        if (!this.$refs.uploadInput) return
        ;(this.$refs.uploadInput as HTMLInputElement).value = ''
      }
    },
    /**
     * Get cropping results
     */
    async getResult() {
      if (!cropper) return

      const image = new window.Image()
      image.src = cropper.getDataURL()
      image.onload = () => {
        this.img2 = image
        this.onResize()
      }
      this.onResize()
    },
    clear() {
      if (!cropper) return
      cropper.clear()
    },
    reset() {
      if (!cropper) return
      cropper.reset()
    },
    cropText(text: string): string {
      return text.replace(/[\s\S]{1,51}(?!)/g, '$&\n')
    },
    updateText(event: Event) {
      this.configText.text =
        "Aujourd'hui il te ramène " + this.cropText((event.target as HTMLTextAreaElement).value)
    },
    exportThierry() {
      const link = document.createElement('a')
      link.download = 'thierry.png'
      link.href = (this.$refs.stage as Stage).getStage().toDataURL({ pixelRatio: 3 })
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    openBottomSheet() {
      ;(this.$refs.myBottomSheet as VueBottomSheet).open()
    },
    closeBottomSheet() {
      this.getResult()
      ;(this.$refs.myBottomSheet as VueBottomSheet).close()
      window.scrollTo(0, 0)
    },
    shareOnBluesky() {},
    onResize() {
      this.stageSize.width = window.innerWidth
      this.stageSize.height = window.innerHeight
      const scale = Math.min(
        this.stageSize.width / (this.imgWidth ?? 1),
        this.stageSize.height / (this.imgHeight ?? 1),
      )
      const w = (this.imgWidth ?? 0) * scale
      const h = (this.imgHeight ?? 0) * scale
      const x = this.stageSize.width / 2 - w / 2
      const y = this.stageSize.height / 2 - h / 2
      // set image only when it is loaded
      this.configThierry = {
        image: this.img,
        x,
        y,
        width: w,
        height: h,
      }
      this.configText = {
        ...this.configText,
        fontSize: 35 * scale,
        x: x + 170 * scale,
        y: y + 1251 * scale,
        width: 810 * scale,
        height: 280 * scale,
      }
      if (this.img2) {
        this.configOther = {
          image: this.img2,
          x: x + 543 * scale,
          y: y + 868 * scale,
          width: 309 * scale,
          height: 302 * scale,
          name: 'other',
          ...getCrop(this.img2!, { width: 309 * scale, height: 302 * scale }),
        }
      }
    },
  },
}
</script>

<style lang="scss">
.fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--vp-button-brand-bg);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  &:hover {
    background-color: var(--vp-button-brand-hover-bg);
  }
}
.fab-save {
  position: fixed;
  bottom: 90px;
  right: 20px;
  background-color: #d306e7;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  &:hover {
    background-color: #a903b8;
  }
}
.fab-bluesky {
  position: fixed;
  bottom: 160px;
  right: 20px;
  background-color: #3299ff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  &:hover {
    background-color: #0056b3;
  }
}
.select-picture {
  position: relative;
  line-height: 38px;
  font-size: 14px;
  color: var(--vp-button-brand-text);
  border-color: var(--vp-button-brand-border);
  background-color: var(--vp-button-brand-bg);
  border-radius: 20px;
  padding: 0 40px;
  margin-bottom: 1em;
  display: inline-block;
  border: 1px solid transparent;
  text-align: center;
  white-space: nowrap;
  transition:
    color 0.25s,
    border-color 0.25s,
    background-color 0.25s;
  cursor: pointer;
  &:hover {
    border-color: var(--vp-button-brand-hover-border);
    color: var(--vp-button-brand-hover-text);
    background-color: var(--vp-button-brand-hover-bg);
  }
  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 0;
    cursor: pointer;
    opacity: 0;
  }
}
.tools {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  .btn {
    position: relative;
    line-height: 32px;
    font-size: 14px;
    color: var(--vp-button-alt-text);
    border-color: var(--vp-button-alt-border);
    background-color: var(--vp-button-alt-bg);
    border-radius: 4px;
    padding: 0 30px;
    margin-left: var(--demo-spacing);
    display: inline-block;
    border: 1px solid transparent;
    text-align: center;
    white-space: nowrap;
    transition:
      color 0.25s,
      border-color 0.25s,
      background-color 0.25s;
    cursor: pointer;
    &.primary {
      color: var(--vp-button-brand-text);
      border-color: var(--vp-button-brand-border);
      background-color: var(--vp-button-brand-bg);
      &:hover {
        color: var(--vp-button-brand-hover-text);
        border-color: var(--vp-button-brand-hover-border);
        background-color: var(--vp-button-brand-hover-bg);
      }
    }
    &:hover {
      color: var(--vp-button-alt-hover-text);
      border-color: var(--vp-button-alt-hover-border);
      background-color: var(--vp-button-alt-hover-bg);
    }
  }
}
#text {
  width: 100%;
  min-height: 20vh;
  background-color: #181a1b;
  color: #ddd;
  font-size: 20px;
  margin: 1em 0;
}
.bottom-sheet__content {
  background-color: rgb(24, 26, 27) !important;
}
.vue--picture-cropper__wrap {
  background-color: #1c1e1f !important;
}
.sheet-content {
  padding: 1em;
  display: flex;
  flex-direction: column;
}
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
</style>
