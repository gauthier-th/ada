import sys
import struct
import pyaudio
import pvporcupine

porcupine = None
pa = None
audio_stream = None
sensitivity = 1

if len(sys.argv) > 0:
    try:
        sensitivity = float(sys.argv[0])
        if sensitivity < 0 or sensitivity > 1:
            sensitivity = 1
    except:
        pass

try:
    porcupine = pvporcupine.create(keyword_paths=['./ok_ada.ppn'], sensitivities=[1])

    pa = pyaudio.PyAudio()

    audio_stream = pa.open(
                    rate=porcupine.sample_rate,
                    channels=1,
                    format=pyaudio.paInt16,
                    input=True,
                    frames_per_buffer=porcupine.frame_length)

    while True:
        pcm = audio_stream.read(porcupine.frame_length)
        pcm = struct.unpack_from("h" * porcupine.frame_length, pcm)

        keyword_index = porcupine.process(pcm)

        if keyword_index >= 0:
            sys.stdout.writelines('hotword')
            sys.stdout.flush()
            if len(sys.argv) != 2 or sys.argv[1] != 'multiple':
                break
finally:
    if porcupine is not None:
        porcupine.delete()

    if audio_stream is not None:
        audio_stream.close()

    if pa is not None:
            pa.terminate()