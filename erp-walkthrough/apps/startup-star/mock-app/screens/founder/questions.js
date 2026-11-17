// The intake questions, one per page, as in the POC. One factory builds every question screen.
import { esc, btn, qcard, radio, chips, tiles, wordCount } from '../../shared/components.js?v=2';

const ROLES = ['founder-women', 'founder-genz', 'founder-midlife'];
const INTERESTS = ['Tech / Software', 'Food & Beverages', 'Fashion & Apparel', 'Education', 'Health & Wellness', 'Retail / E-commerce', 'Agriculture', 'Services / Consulting', 'Manufacturing', 'Finance / Fintech'];
const SKILLS = ['Sales & Marketing', 'Technology / Coding', 'Design / Creative', 'Finance / Accounting', 'Operations / Management', 'Teaching / Training', 'Communication / Writing', 'Domain Expertise'];
const BUDGETS = ['Under ₹10,000', '₹10,000 – ₹50,000', '₹50,000 – ₹2 Lakh', '₹2 Lakh – ₹10 Lakh', 'Above ₹10 Lakh'];
const TYPES = ['Product-based', 'Service-based', 'Online / Digital', 'Franchise', 'Not sure yet'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur'];
const STAGES = [{ id: 'idea', label: 'Idea', icon: '💡', desc: "Just an idea, haven't started" }, { id: 'prototype', label: 'Prototype', icon: '🔧', desc: 'Building or testing' }, { id: 'revenue', label: 'Revenue', icon: '💰', desc: 'Already earning' }];
const WHERE = [{ id: 'local', label: 'Local / Physical', icon: '📍', desc: 'Specific city or region' }, { id: 'online', label: 'Online / Pan-India', icon: '🌐', desc: 'Anywhere in India' }, { id: 'global', label: 'Online / Pan-world', icon: '🌍', desc: 'Global market' }];

const other = (placeholder) => `<div class="add-row"><input placeholder="${esc(placeholder)}" data-toast="Your own answer would be added."><button class="btn btn-outline" data-toast="Add would put your own answer in the list.">Add</button></div>`;
const followup = (data, i) => { const q = data.followups[i]; return qcard(q.text, 'Pick the option that best describes you right now', radio(q.options, q.a, 'Answer') + radio(['Other'], '', 'Answer')); };
const extra = (data, i) => { const x = data.persona.extra[i]; return qcard(x.title, x.sub, radio(x.options, x.a, x.label)); };

const QUESTIONS = {
  W02: { name: 'Business Idea', body: (d) => qcard('Describe your business idea', 'This is the foundation of your entire personalized report',
    `<textarea data-toast="Your idea would be saved. Up to 50 words.">${esc(d.business.idea)}</textarea>
     <div class="meta"><span>${wordCount(d.business.idea)} / 50 words</span><span>e.g. ${esc(d.persona.hint)}</span></div>`) },
  W03: { name: 'Business Stage', body: (d) => qcard('What stage are you at?', 'We tailor the analysis based on where you are in your journey', tiles(STAGES, d.business.stage, 'Stage')) },
  W04: { name: 'Main Concern', body: (d) => qcard("What's your biggest challenge right now?", "We'll make sure your report addresses this directly",
    radio(d.persona.concerns, d.business.concern, 'Challenge') + radio(['Other'], '', 'Challenge')) },
  W05: { name: 'Location', body: (d) => {
    const b = d.business;
    const city = b.location === 'local'
      ? `<div><label class="label">Search your city</label><input value="${esc(b.city)}" placeholder="Type city name..." data-toast="Cities would be filtered as you type."><div class="chips" style="margin:12px 0">${CITIES.map((c) => `<button type="button" class="chip${c === b.city ? ' on' : ''}" data-toast="${esc(`${c} would be chosen.`)}">${esc(c)}</button>`).join('')}</div>
         <button class="link-faint" data-toast="My city isn't in this list would ask for State, District and Place instead.">My city isn't in this list →</button></div>` : '';
    return qcard('Where will your business operate?', 'Enables us to provide city-specific insights and local market data', tiles(WHERE, b.location, 'Location') + city);
  } },
  W06: { name: 'About you (1)', body: (d) => extra(d, 0) },
  W07: { name: 'About you (2)', body: (d) => extra(d, 1) },
  W08: { name: 'Interests', body: (d) => qcard('What are your passion areas?', 'Select all that apply. These shape your personalized business ideas', chips(INTERESTS, d.profile.interests, 'Interest') + other('Other (type and press Add)')) },
  W09: { name: 'Skills', body: (d) => qcard('What are your strongest skills?', "We match business ideas to what you're already good at", chips(SKILLS, d.profile.skills, 'Skill') + other('Other (type and press Add)')) },
  W10: { name: 'Budget', body: (d) => qcard("What's your startup budget?", 'We recommend ideas that fit comfortably within your range', radio(BUDGETS, d.profile.budget, 'Budget') + radio(['Other'], '', 'Budget')) },
  W11: { name: 'Business Type', body: (d) => qcard('What type of business do you prefer?', "Don't worry, you can always refine this later", tiles(TYPES.map((t) => ({ id: t, label: t })), d.profile.businessType, 'Business type', 3)) },
  W12: { name: 'Experience', body: (d) => followup(d, 0) },
  W13: { name: 'Time', body: (d) => followup(d, 1) },
  W14: { name: 'Mindset', body: (d) => followup(d, 2) }
};
const ORDER = Object.keys(QUESTIONS);

export const questionCodes = ORDER;

export function makeScreen(code) {
  const q = QUESTIONS[code];
  return {
    meta: { code, name: q.name, side: 'founder', icon: 'idea', nav: q.name, roles: ROLES },
    render: ({ data }) => `${q.body(data)}<div class="stack" style="margin-top:16px">${btn('Continue →', { action: 'continue', goto: ORDER[ORDER.indexOf(code) + 1] ?? 'W15', size: 'lg', block: true })}</div>`
  };
}
