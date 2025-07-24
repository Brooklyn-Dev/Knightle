const audioCtx = new AudioContext();

export async function playSound(filepath) {
	const res = await fetch(filepath);
	const buffer = await res.arrayBuffer();
	const decoded = await audioCtx.decodeAudioData(buffer);

	const source = audioCtx.createBufferSource();
	source.buffer = decoded;
	source.connect(audioCtx.destination);
	source.start();
}
