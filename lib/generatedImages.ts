// Slower method
// const generatedImages = Array.from({ length: 11 }).map((_, i) => {
//   const c = i + 1
//   return {
//     id: c,
//     src: `/images/image-${c}.${c < 10 ? "webp" : "jpeg"}`,
//   }
// })




const generatedImages = []
for (let i = 1; i < 12; i++) {
    generatedImages.push({
        id: i.toString(),
        src: `./images/image-${i}.${i < 10 ? "webp" : "jpeg"}`,
    })
}

export default generatedImages