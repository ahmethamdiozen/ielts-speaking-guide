const card = (id, type, prompt, b1, b2, b3) => ({
  id, type, prompt, bullets: [b1, b2, b3, 'and explain why it is important to you'],
})

export default [
  card('person-admire', 'person', 'Describe a person you admire.', 'who this person is', 'how you know them', 'what they do'),
  card('person-helped', 'person', 'Describe a person who has helped you.', 'who this person is', 'how they helped you', 'when it happened'),
  card('person-teacher', 'person', 'Describe a teacher who influenced you.', 'who the teacher was', 'what subject they taught', 'what they were like'),
  card('person-friend', 'person', 'Describe a friend you enjoy spending time with.', 'who this friend is', 'how you met', 'what you do together'),
  card('place-city', 'place', 'Describe a city you have visited and liked.', 'where it is', 'when you went there', 'what you did there'),
  card('place-quiet', 'place', 'Describe a quiet place where you like to spend time.', 'where it is', 'what it looks like', 'what you do there'),
  card('place-childhood', 'place', 'Describe a place you often visited as a child.', 'where it was', 'who you went with', 'what you did there'),
  card('place-restaurant', 'place', 'Describe a restaurant you enjoyed eating at.', 'where it is', 'what food you ate', 'who you went with'),
  card('object-gift', 'object', 'Describe a gift you received that you liked.', 'what it was', 'who gave it to you', 'when you received it'),
  card('object-tech', 'object', 'Describe a piece of technology you use often.', 'what it is', 'how often you use it', 'what you use it for'),
  card('object-old', 'object', 'Describe something old that you keep.', 'what it is', 'how long you have had it', 'where you keep it'),
  card('object-book', 'object', 'Describe a book you enjoyed reading.', 'what the book was', 'when you read it', 'what it was about'),
  card('event-party', 'event', 'Describe a party or celebration you enjoyed.', 'what the occasion was', 'who was there', 'what happened'),
  card('event-special', 'event', 'Describe a special event you attended.', 'what the event was', 'where it took place', 'who you went with'),
  card('event-busy', 'event', 'Describe an occasion when you were very busy.', 'when it was', 'what you had to do', 'how you managed'),
  card('event-news', 'event', 'Describe a time you received good news.', 'what the news was', 'who told you', 'how you reacted'),
  card('exp-challenge', 'experience', 'Describe a time you did something difficult.', 'what you did', 'why it was difficult', 'how you managed'),
  card('exp-skill', 'experience', 'Describe a skill you learned and enjoyed.', 'what the skill is', 'how you learned it', 'how you use it now'),
  card('exp-helped', 'experience', 'Describe a time you helped someone.', 'who you helped', 'what you did', 'how they reacted'),
  card('exp-proud', 'experience', 'Describe something you achieved that you are proud of.', 'what you achieved', 'how you did it', 'who helped you'),
]
