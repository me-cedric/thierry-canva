/**
 * Calculates the cropping dimensions and position for an image based on the specified size and clip position.
 *
 * @param {HTMLImageElement} image - The image element to be cropped.
 * @param {Object} size - The desired size of the cropped image.
 * @param {number} size.width - The desired width of the cropped image.
 * @param {number} size.height - The desired height of the cropped image.
 * @param {string} [clipPosition='center-middle'] - The position to clip the image.
 *        Possible values are 'left-top', 'left-middle', 'left-bottom', 'center-top',
 *        'center-middle', 'center-bottom', 'right-top', 'right-middle', 'right-bottom', 'scale'.
 *        Defaults to 'center-middle'.
 * @returns {Object} An object containing the cropping coordinates and dimensions.
 * @returns {number} cropX - The x-coordinate of the top-left corner of the cropping area.
 * @returns {number} cropY - The y-coordinate of the top-left corner of the cropping area.
 * @returns {number} cropWidth - The width of the cropping area.
 * @returns {number} cropHeight - The height of the cropping area.
 */
export const getCrop = (
  image: HTMLImageElement,
  size: { width: number; height: number },
  clipPosition = 'center-middle',
): {
  cropX: number
  cropY: number
  cropWidth: number
  cropHeight: number
} => {
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
}
