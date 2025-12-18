<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let onComplete: () => void;

  const images = [
    { src: "/logo_save_real_load.png", direction: "center" },
    { src: "/MPBR.png", direction: "center" },
    { src: "/CasaLilianIMG.png", direction: "center" },
    { src: "/logo_casa_lilian_real.png", direction: "center" },
  ];

  let currentIndex = 0;
  let showImage = true;

  function getTransition(direction: string) {
    switch (direction) {
      case "center":
        return { x: 0, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  }

  onMount(() => {
    const interval = setInterval(() => {
      showImage = false;

      setTimeout(() => {
        currentIndex++;
        if (currentIndex >= images.length) {
          clearInterval(interval);
          onComplete();
        } else {
          showImage = true;
        }
      }, 200);
    }, 1200);

    return () => clearInterval(interval);
  });
</script>

<div
  class="fixed inset-0 z-50 flex items-center justify-center"
  style="background: linear-gradient(135deg, #464775 0%, #FFFFFF 50%, #464775 100%);"
  transition:fade={{ duration: 200 }}
>
  <div class="relative w-80 h-80 flex items-center justify-center">
    {#if showImage && currentIndex < images.length}
      {@const img = images[currentIndex]}
      {@const trans = getTransition(img.direction)}
      <div
        class="absolute flex flex-col items-center"
        in:fly={{ x: -trans.x, y: -trans.y, duration: 200, delay: 50 }}
        out:fly={{ x: trans.x, y: trans.y, duration: 200, delay: 50 }}
      >
        <img
          src={img.src}
          alt="Logo"
          class="max-w-64 max-h-64 object-contain drop-shadow-2xl"
        />
      </div>
    {/if}
  </div>

  <!-- Progress dots -->
  <div class="absolute bottom-16 flex gap-3">
    {#each images as _, i}
      <div
        class="w-3 h-3 rounded-full transition-all duration-300 {i ===
        currentIndex
          ? 'bg-white scale-125'
          : 'bg-white/30'}"
      ></div>
    {/each}
  </div>

  <!-- Loading text -->
  <div class="absolute bottom-8 text-white/70 text-sm font-medium">
    Carregando sistema...
  </div>
</div>
