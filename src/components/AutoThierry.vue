<template>
  <v-stage ref="stage" :config="stageSize">
    <v-layer ref="layer">
      <v-image :config="configThierry" />
      <v-image :config="configOther" ref="otherImage" />
    </v-layer>
  </v-stage>
</template>

<script lang="ts">
import img from '@/assets/thierry-base.png'
import img2 from '@/assets/thierry-base.png'
// import img2 from '@/assets/tintin.png'

let count = 0
export default {
  props: {
    path: String,
  },
  data() {
    return {
      stageSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      configThierry: {
        image: null,
        offsetX: null,
        offsetY: null,
        width: null,
        height: null,
      },
      configOther: {
        image: null,
        offsetX: null,
        offsetY: null,
        width: null,
        height: null,
      },
      img: null,
      img2: null,
      imgWidth: null,
      imgHeight: null,
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
    getCrop(image, size, clipPosition = 'center-middle') {
      const width = size.width
      const height = size.height
      const aspectRatio = width / height

      let newWidth
      let newHeight

      const imageRatio = image.width / image.height

      if (aspectRatio >= imageRatio) {
        newWidth = image.width
        newHeight = image.width / aspectRatio
      } else {
        newWidth = image.height * aspectRatio
        newHeight = image.height
      }

      let x = 0
      let y = 0
      if (clipPosition === 'left-top') {
        x = 0
        y = 0
      } else if (clipPosition === 'left-middle') {
        x = 0
        y = (image.height - newHeight) / 2
      } else if (clipPosition === 'left-bottom') {
        x = 0
        y = image.height - newHeight
      } else if (clipPosition === 'center-top') {
        x = (image.width - newWidth) / 2
        y = 0
      } else if (clipPosition === 'center-middle') {
        x = (image.width - newWidth) / 2
        y = (image.height - newHeight) / 2
      } else if (clipPosition === 'center-bottom') {
        x = (image.width - newWidth) / 2
        y = image.height - newHeight
      } else if (clipPosition === 'right-top') {
        x = image.width - newWidth
        y = 0
      } else if (clipPosition === 'right-middle') {
        x = image.width - newWidth
        y = (image.height - newHeight) / 2
      } else if (clipPosition === 'right-bottom') {
        x = image.width - newWidth
        y = image.height - newHeight
      } else if (clipPosition === 'scale') {
        x = 0
        y = 0
        newWidth = width
        newHeight = height
      } else {
        console.error(new Error('Unknown clip position property - ' + clipPosition))
      }

      return {
        cropX: x,
        cropY: y,
        cropWidth: newWidth,
        cropHeight: newHeight,
      }
    },
    onResize() {
      this.stageSize.width = window.innerWidth
      this.stageSize.height = window.innerHeight
      const scale = Math.min(
        this.stageSize.width / this.imgWidth,
        this.stageSize.height / this.imgHeight,
      )
      const w = this.imgWidth * scale
      const h = this.imgHeight * scale
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
      const slotWidth = 309 * scale
      const slotHeight = 302 * scale
      const centerShiftX = (slotWidth - this.img2.width * scale) / 2
      const centerShiftY = (slotHeight - this.img2.height * scale) / 2
      const scale2 = Math.min((309 * scale) / this.img2.width, (302 * scale) / this.img2.height)
      this.configOther = {
        image: this.img2,
        x: x + 543 * scale,
        y: y + 868 * scale,
        width: 309 * scale,
        height: 302 * scale,
        name: 'other',
        ...this.getCrop(this.img2, { width: 309 * scale, height: 302 * scale }),
      }
    },
  },
}
</script>
