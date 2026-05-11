-- Migration 009: Backfill romantic captions for memories without description
-- Run in Supabase Dashboard → SQL Editor

UPDATE memories
SET description = (ARRAY[
  'There are places we return to not because we have to, but because something in us never truly left.',
  'Some moments don''t ask to be remembered — they simply stay, quietly, like a song you didn''t know you learned.',
  'In the middle of everything ordinary, there was this — and it was enough to change the whole day.',
  'Not every beautiful thing is loud. Some of them just sit beside you and breathe.',
  'I didn''t need a map. I only needed to know you were there, and that was direction enough.',
  'Time doesn''t stop, but sometimes it slows — just long enough to let you feel it fully.',
  'The best things aren''t planned. They arrive quietly, take off their coat, and stay.',
  'I keep coming back to this moment the way you return to a favourite page — not to find something new, but to feel something real.',
  'There is a kind of warmth that doesn''t ask for anything. It just exists, steady and soft, the way you do.',
  'We were just here, doing nothing particular — and somehow that became everything.',
  'You don''t need to explain certain things. Some feelings are only for the two people who were there.',
  'The world kept moving. We didn''t notice. We were too busy being still together.',
  'It''s the small things that hold the most weight — the way the light fell, the way you laughed, the quiet that followed.',
  'Not every love is written in grand gestures. Some of it lives in an afternoon like this one.',
  'I would choose this again. Not the version where everything is perfect — this version, exactly as it was.',
  'There is something about being known by someone that makes even the simplest moment feel like shelter.',
  'We didn''t say much. We didn''t have to. Being close was already the whole conversation.',
  'This is what I want to remember when everything else fades — not the big moments, but this one.',
  'Somewhere between ordinary and extraordinary, there is a place only two people can find. We found it here.',
  'Beauty isn''t always something you seek. Sometimes it just happens while you''re not looking, and you catch it just in time.',
  'The photograph holds what words can''t quite reach — the particular quality of that light, that silence, that feeling.',
  'I don''t think happiness always announces itself. Sometimes it just settles in quietly, like this.',
  'Every story has a page that doesn''t need to be read aloud. This is ours.',
  'There''s a version of every day that no one else will ever see. This one belongs to us.',
  'You have a way of making ordinary places feel like somewhere I''ve always wanted to be.',
  'Nothing remarkable happened. Nothing remarkable needed to.',
  'Some things are too tender to describe. So we let the image speak instead.',
  'I didn''t fall in love all at once. I fell slowly, in moments exactly like this.',
  'The softest kind of joy is the kind you don''t realise you''re carrying until later, when you look back.',
  'We built nothing here — no milestone, no occasion. Just the quiet certainty of being together.',
  'Time is always moving. But this moment felt like it waited — just long enough for us to notice.',
  'There is a difference between being seen and being known. You have always known me.',
  'I don''t need the whole world to make sense. I just need you to be in the frame.',
  'The day was simple. The feeling was not.',
  'Not all anchors are heavy. Some of them are as light as a person who stays.'
])[floor(random() * 35 + 1)]
WHERE description IS NULL;
