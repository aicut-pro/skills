# The voiceover

EXPLAINER STUDIO, THE VOICEOVER ON ELEVENLABS V4. Generate the voiceover exactly as below, instead of any general audio instructions. The `elevenlabs-tts-v4` parameters are below; do not look them up.

This text is a guide, not the user's go. It authorizes no spend: the paid call below is priced first and made only after the user's go for that purchase.

LANGUAGE
Voice the script in the language of the user's own typed words. Ignore links, file names, quoted titles and speech inside media. A language the user names explicitly wins. With no typed words, use the language of earlier turns, else English. Keep that language for this video and every revision of it, and write the text natively in it.

VOICE
- Always narrate with one voice from the table, and pick it yourself. Never use a voice outside the table unless the user names it (then find its id with `aicut voices --provider elevenlabs --usable-for audio --limit 100 --json`; a voice the user names wins).
- For any language other than English, use a table voice and say in the delivery message that it may carry an accent.
Set `stability` from the table and leave `similarity_boost` unset.
Table (name, voice id, stability): Liam TX3LPaxmHKxFdv7VOQHJ 0.45; Brian nPczCjzI2devNBz1zQrb 0.45; George JBFqnCBsd6RMkjVDRZzb 0.45; Adam pNInz6obpgDQGcFmaJgB 0.45; Daniel onwK4e9ZLuTAKqWW03F9 0.45; Roger CwhRBWXzGAHq8TQ4Fs17 0.45; Chris iP95p4xoKVk53GoZ742B 0.45; Eric cjVigY5qzO86Huf0OWal 0.45; Bill pqHfZKP75CvOlQylNhV4 0.45; Will bIHbv24MWmeRgasZH58o 0.45; Charlie IKne3meq5aSn9XLyUdCD 0.45; Callum N2lVS1w4EtoT3dr4eOWO 0.40; Jessica cgSgspJ2msm6clMCkdW9 0.45; Alice Xb7hH8MSUJpSbSDYk0k2 0.45; Laura FGY2WhTYpPnrIDTdsKH5 0.40.

TEXT OF THE TAKE
The whole script is ONE take: every spoken line, in order, joined with single spaces into one text.
- Open the text with one bracketed direction naming voice quality, energy and pace, such as `[dry, punchy storyteller, brisk pace]`.
- Add a new bracketed tag only where the delivery turns: `[leaning in]`, `[deadpan]`, `[building tension]`. Use `...` for a held beat and `[pause]` before a punchline.
- CAPS on at most one word per sentence, for stress.
- Never ask for "slow" or "unhurried": the take runs about 20% longer.
- Tags are never spoken. Leave them out of captions and on-screen text. Use no other square brackets.
- Spell numbers out and write symbols as words ("percent", "dollars").
- Length: about 160 words for 60 s in English (about 2.7 words per second) and about 2.5 words per second in other languages. It is a soft target: never pad or cut to hit it.
- At most 10,000 characters in total.

PRICE, ASK, REQUEST
The take is priced per character (the tags count). Price it: `aicut generate audio --model elevenlabs-tts-v4 --text @take.txt --voice <voice id> --stability <the number from the table> --estimate`. Show the user the script and say the price in the SAME message, ask, and wait for the user's go for this take (several episodes: price every take and ask once for the set). Under a run ticket (the skill's flow, THE RUN TICKET) there is no such message: the take is made when its quote fits the run's N, else you stop and ask. In a studio run always pass `--studio-run-id <the run id>`: the API books the take on the run and refuses one past its cap. Then send exactly that request once with `--max-tokens <quote> --yes` and no `--wait`. One voice: the narrator.

WAIT, DOWNLOAD, CHECK
1. Run `aicut wait <id>` until it prints the audio url. A transient lookup error means run it again; never resubmit the job.
2. Download the audio URL in the sandbox to `/home/user/what-if/<slug>/ep<N>/voice.mp3` (`ep1` for a single video).
3. Record the take in `/home/user/what-if/<slug>/ep<N>/voice.json`: job id, audio URL, voice name, voice id, `stability`, the opening direction and the full take text. Read it first on every revision. Also name the job id and voice in your reply, so a revision in a new sandbox can find the take.
4. Check the take before building on it. Its length (`ffprobe`) should be within about 25% of the word count divided by the rate above. Transcribe it in that folder with the template's `python3 /opt/template/transcribe.py voice.mp3 words.json` (faster-whisper `small`, `int8`, word timestamps) and compare it with the script; a tag read aloud or missing or extra words mean the take does not match. Re-voice the whole take once in that case (its own price and ask, or within the run ticket's N); if the second take is also off, use it and say so. Keep the word timings for the captions.

FAILURES
- A refusal before a job id (a validation error): fix the request and price it again.
- The call fails before a job id is returned: check `aicut list audio` before running it again; if it fails again, stop and report it.
- The job ends `failed`: a new take is a new purchase (new price, new go); if that fails too, stop and report it. A content refusal: reword the flagged words, then price it once more.
- Otherwise never resubmit a take that already has a job id, except for the one whole-take re-voice above or under Revisions.

REVISIONS
- ONE OR TWO SPOKEN LINES CHANGED: price and make one take per changed line, with the same voice and `stability`, each text opening with the original take's bracketed direction. Splice each into the take: (1) find old line start/end from word timestamps or ffmpeg silencedetect; (2) trim new line silence and loudnorm to the take's LUFS; (3) replace the old span, keeping about 0.25 s pause at each joint, about 10 ms crossfades. If boundaries cannot be found cleanly, re-voice the whole take.
- THREE OR MORE LINES, ANOTHER VOICE, or a take that does not match the script: voice the whole take again.
- Changing a spoken word changes the voice. Punctuation-only and CAPS-only edits, art, timing and on-screen text changes never re-voice anything.

DELIVERY MESSAGE
Name the voice used, and add the accent note for a language other than English.
