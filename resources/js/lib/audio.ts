let unlocked = false;

export function unlockAudio() {
    if (unlocked) return;

    const audio = new Audio();
    audio.play().catch(() => {});
    unlocked = true;
}

export function createAudio(src: string, volume = 1) {
    const audio = new Audio(src);
    audio.volume = volume;
    return audio;
}
