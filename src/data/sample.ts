import { extractEntities } from '../core/entities';
import type { Memory } from '../core/types';

interface SampleInput { id: string; date: string; text: string; category: string; importance: Memory['importance']; pinned?: boolean; shareable?: boolean; }

function sampleMemory(input: SampleInput): Memory {
  const entities = extractEntities(input.text);
  return {
    id: input.id,
    text: input.text,
    createdAt: `${input.date}T12:00:00.000Z`,
    category: input.category,
    importance: input.importance,
    pinned: input.pinned ?? input.importance >= 5,
    shareable: input.shareable ?? true,
    archived: false,
    entities,
    facts: entities.facts,
  };
}

export const sampleMemories: Memory[] = [
  sampleMemory({ id: 'sample-01', date: '2026-09-01', text: 'I started a calmer weekly review for my work and personal goals.', category: 'goal', importance: 4 }),
  sampleMemory({ id: 'sample-02', date: '2026-09-03', text: 'I work at Northstar Labs as a product designer on the Atlas project.', category: 'work', importance: 5 }),
  sampleMemory({ id: 'sample-03', date: '2026-09-04', text: 'The Atlas team is testing a shared memory graph for project decisions.', category: 'work', importance: 4 }),
  sampleMemory({ id: 'sample-04', date: '2026-09-05', text: 'I live in Portland near the river and enjoy walking there after work.', category: 'place', importance: 5 }),
  sampleMemory({ id: 'sample-05', date: '2026-09-06', text: 'I bought a train ticket to Seattle for the design research meetup.', category: 'travel', importance: 3 }),
  sampleMemory({ id: 'sample-06', date: '2026-09-08', text: 'Alex Rivera will join me in Seattle to interview users about the Atlas project.', category: 'person', importance: 4 }),
  sampleMemory({ id: 'sample-07', date: '2026-09-09', text: 'I want to protect Wednesday evenings for deep work and fewer meetings.', category: 'goal', importance: 4 }),
  sampleMemory({ id: 'sample-08', date: '2026-09-10', text: 'The team liked the simpler dashboard concept and asked for a small prototype.', category: 'work', importance: 3 }),
  sampleMemory({ id: 'sample-09', date: '2026-09-12', text: 'I tried a new vegetarian ramen place in Portland with Alex.', category: 'food', importance: 3 }),
  sampleMemory({ id: 'sample-10', date: '2026-09-14', text: 'My favorite quick breakfast is yogurt, berries, and toasted walnuts.', category: 'food', importance: 2 }),
  sampleMemory({ id: 'sample-11', date: '2026-09-15', text: 'I am tracking meals so I can keep energy steady during research weeks.', category: 'goal', importance: 3 }),
  sampleMemory({ id: 'sample-12', date: '2026-09-17', text: 'The Seattle meetup helped me clarify the Atlas onboarding problem.', category: 'travel', importance: 4 }),
  sampleMemory({ id: 'sample-13', date: '2026-09-18', text: 'I work at Juniper Systems now and am transitioning away from Northstar Labs.', category: 'work', importance: 5 }),
  sampleMemory({ id: 'sample-14', date: '2026-09-19', text: 'I live in Seattle for the next phase of the research project.', category: 'place', importance: 5 }),
  sampleMemory({ id: 'sample-15', date: '2026-09-20', text: 'My travel checklist includes a charger, notebook, comfortable shoes, and snacks.', category: 'travel', importance: 2 }),
  sampleMemory({ id: 'sample-16', date: '2026-09-21', text: 'I want to run three times a week before breakfast while I am in Seattle.', category: 'goal', importance: 3 }),
  sampleMemory({ id: 'sample-17', date: '2026-09-22', text: 'Juniper Systems uses a thoughtful critique ritual that could help the Atlas team.', category: 'work', importance: 4 }),
  sampleMemory({ id: 'sample-18', date: '2026-09-24', text: 'Contact me at maya.chen@example.test or +1 503-555-0147 for the meetup notes.', category: 'person', importance: 2 }),
  sampleMemory({ id: 'sample-19', date: '2026-09-25', text: 'The backup card for the conference budget is 4242 4242 4242 4242.', category: 'travel', importance: 2, shareable: false }),
  sampleMemory({ id: 'sample-20', date: '2026-09-27', text: 'I found a great lentil bowl near the Seattle studio and want to return.', category: 'food', importance: 3 }),
  sampleMemory({ id: 'sample-21', date: '2026-09-29', text: 'My October goal is to finish the Atlas prototype and publish the research notes.', category: 'goal', importance: 5 }),
  sampleMemory({ id: 'sample-22', date: '2026-10-01', text: 'Alex suggested pairing the meal tracker with the weekly review.', category: 'idea', importance: 3 }),
  sampleMemory({ id: 'sample-23', date: '2026-10-03', text: 'I am keeping Friday afternoons open for travel planning and long walks.', category: 'goal', importance: 3 }),
  sampleMemory({ id: 'sample-24', date: '2026-10-05', text: 'The Atlas prototype is ready for a small round of user feedback.', category: 'work', importance: 4 }),
  sampleMemory({ id: 'sample-25', date: '2026-10-08', text: 'I want to make the next research trip lighter, healthier, and more deliberate.', category: 'goal', importance: 4 }),
];
