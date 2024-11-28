<template>
  <v-stage ref="stage" :config="stageSize">
    <v-layer ref="layer">
      <v-image :config="configThierry" />
      <v-image :config="configOther" />
      <v-text :config="configText" />
    </v-layer>
  </v-stage>
</template>

<script lang="ts">
import { default as img, default as img2 } from '@/assets/thierry-base.png'
import { getCrop } from '@/core/helpers'
// import img2 from '@/assets/tintin.png'

let count = 0
export default {
  props: {
    path: String,
  },
  data(): {
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
    img?: HTMLImageElement
    img2?: HTMLImageElement
    imgWidth?: number
    imgHeight?: number
  } {
    const t =
      'Aujourd’hui, il te ramène un Roboraptor pour que \ntu puisse faire la scene dans la cuisine de Jurassic \nPark entre autre chez toi. Avec son son stéréo et \nses multiples capteurs tu auras l’impression d’avoir \nun véritable petit raptor chez toi. \nEn plus c’est un cousin éloigné de Thierry.'
    const text =
      'Aujourd’hui, il te ramène un Roboraptor pour que tu puisse faire la scene dans la cuisine de Jurassic Park entre autre chez toi. Avec son son stéréo et ses multiples capteurs tu auras l’impression d’avoir un véritable petit raptor chez toi. En plus c’est un cousin éloigné de Thierry.'.replace(
        /[\s\S]{1,51}(?!)/g,
        '$&\n',
      )
    return {
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
        text,
        align: 'left',
        lineHeight: 1.2,
        fill: '#fff',
        x: 170,
        y: 1251,
        width: 810,
        height: 280,
      },
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
      count = count + 1
      if (count == 2) {
        this.onResize()
      }
    }
    const image2 = new window.Image()
    image2.src = img2
    image2.onload = () => {
      this.img2 = image2
      count = count + 1
      if (count == 2) {
        this.onResize()
      }
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
      this.configOther = {
        image: this.img2,
        x: x + 543 * scale,
        y: y + 868 * scale,
        width: 309 * scale,
        height: 302 * scale,
        name: 'other',
        ...getCrop(this.img2!, { width: 309 * scale, height: 302 * scale }),
      }
      this.configText = {
        ...this.configText,
        fontSize: 35 * scale,
        x: x + 170 * scale,
        y: y + 1251 * scale,
        width: 810 * scale,
        height: 280 * scale,
      }
    },
  },
}
</script>
