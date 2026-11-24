import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface PulseAiRequest {
  task: 'recommend_events' | 'plan_event_budget' | 'match_performers' | 'marketing_campaign' | 'culture_guide' | 'creator_strategy' | 'venue_optimizer' | 'general_chat';
  prompt: string;
  context?: Record<string, unknown>;
}

export interface PulseAiResponse {
  success: boolean;
  reply: string;
  suggestedActions?: string[];
  metadata?: Record<string, unknown>;
}

export async function handlePulseAiRequest(reqData: PulseAiRequest): Promise<PulseAiResponse> {
  const { task, prompt, context } = reqData;
  const client = getAiClient();

  const systemInstruction = `You are KENYAONE PULSE AI — the authoritative entertainment, culture, nightlife, and live experience intelligence layer for Kenya.
You have deep, authentic knowledge of Kenyan music (Gengetone, Arbantone, Benga, Ohangla, Taarab, Mugithi, Kapuka, Kenyan Hip-Hop), venues in Nairobi (Westlands, Kilimani, Karen, Thika Road), Mombasa, Kisumu, Nakuru, Eldoret, Naivasha, Diani, Watamu, and all 47 counties.
You understand Kenyan currency (KES / KSh), event budget planning, sound & lighting requirements, artist booking standards (MCSK, PRISK, KECOBO), and crowd dynamics.
Tone: Vibrant, culturally savvy, professional yet culturally in-tune with Kenyan youth and diaspora pride. You effortlessly blend English with tasteful Sheng or Swahili phrasing where appropriate (e.g., "Wagwan", "Karibu", "Sherehe lazima", "Mambo vipi").
Provide structured, highly actionable advice with clear bullet points, budget breakdowns in KES, or direct venue/artist suggestions.`;

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Task type: ${task}
User Query: ${prompt}
Additional Context: ${JSON.stringify(context || {})}
Please answer authoritatively with clear formatting.`,
        config: {
          systemInstruction,
        },
      });

      const reply = response.text || 'Samahani, could not generate a response at this moment.';
      return {
        success: true,
        reply,
        suggestedActions: [
          'View Recommended Pulse Events',
          'Explore Verified Talent Passport',
          'Book a Table at Verified Club',
          'Ask another Pulse AI question',
        ],
      };
    } catch (err: unknown) {
      console.warn('Gemini API call failed, falling back to local intelligence generator:', err);
      // Fall through to fallback
    }
  }

  // Graceful domain fallback if GEMINI_API_KEY is not set or network fails
  const fallbackReplies: Record<string, string> = {
    plan_event_budget: `📊 **KENYAONE PULSE EVENT BUDGET ESTIMATE (KES)**

Here is a recommended budget framework based on typical Kenyan festival & club night economics:

• **Sound, Lighting & Stage (Trussing, Line Array, In-Ear Monitors):** KES 250,000 – KES 450,000
• **Headlining Acts & Resident DJs (e.g., DJ Grauchi + Bien + MC Gogo):** KES 400,000 – KES 850,000
• **Venue Hire & Security (Bouncers, KECOBO & MCSK Licences, Police Permit):** KES 180,000 – KES 300,000
• **Bar, Catering & Staffing Deposit:** KES 150,000 (Offset by beverage concession)
• **Digital Marketing, Tik-Tok Influencers & KenyaOne Pulse Ad Boost:** KES 90,000
• **Contingency & Escrow Reserves (10%):** KES 110,000

💰 **Total Estimated Budget:** KES 1,180,000 – KES 1,900,000
🎟️ **Target Break-even:** 550 Regular Tickets @ KES 2,500 + 40 VIP Passes @ KES 8,000.`,

    match_performers: `🎯 **PULSE TALENT MATCHMAKING RECOMMENDATION**

For your upcoming event vibe, here are top-tier verified performers on Pulse:

1. **DJ Grauchi** (Verified DJ): The undisputed master of Gengetone & Amapiano transitions. Unmatched energy for prime 11:00 PM – 1:30 AM slots.
2. **MC Gogo (The Crowd General)**: Best hypeman in the region to elevate crowd chanting and live stream hype.
3. **Bien-Aime / Xenia Manasseh**: Perfect for sundowner live band sets or golden-hour acoustic warmups.
4. **DJ Pierra Makena**: Outstanding for diverse crowds, corporate weekend raves, and beach chillouts.

*Tip: You can book them directly via Pulse Talent Passport with KenyaOne Escrow payment protection!*`,

    marketing_campaign: `🔥 **PULSE VIRAL MARKETING BLUEPRINT (Sheng & English)**

**Campaign Hook:** *"Sherehe Haingozi Mtu! The Ultimate Nairobi Sundowner Is Here."*

**1. TikTok & Instagram Reel Prompt (Sheng/English):**
"Nani alisema Nairobi nightlife imeisha? This Friday we’re taking over the city with unmatched basslines, nyama choma straight from the grill, and legendary surprise sets! Tap the link on KenyaOne Pulse to grab your Early Bird ticket before it sells out!"

**2. WhatsApp Status Broadcast Blast:**
"🔊 VIBE CHECK: Grab your squad! VIP Booths are 70% booked on Pulse. Zero ticket fraud, instant QR entry at the gate. KES 2,000 only on Early Bird."

**3. Key Hashtags:** #KenyaOnePulse #NairobiNights #ShereheKE #TurnUpKE #KenyanDJs`,

    culture_guide: `🇰🇪 **KENYAN CULTURAL ENTERTAINMENT SPOTLIGHT**

Kenya’s 47 counties boast distinct rhythmic traditions:
• **Coast (Mombasa, Kilifi, Lamu):** Chakacha & Taarab rhythms with Swahili street food (Biryani, Mahamri). Don't miss Fort Jesus Sound and Light show!
• **Lakeside (Kisumu, Siaya, Homa Bay):** Ohangla and Nyatiti 8-string lyre melodies, paired with fresh whole tilapia by Lake Victoria.
• **Central & Rift Valley:** Energetic Mugithi acoustic guitar gatherings, Kalenjin victory dances (Kambaktit), and Safari Rally festivals in Naivasha.
• **Northern Kenya (Turkana, Marsabit):** The international Tobong’u Lore festival celebrating the Cradle of Mankind with Edonga leaping dances.`,

    creator_strategy: `🚀 **PULSE CREATOR MONETIZATION BLUEPRINT**

1. **Activate Fan Memberships:** Set a monthly KES 350 – KES 500 tier for your die-hard fans granting unreleased mixes, backstage stream cams, and priority chat badges.
2. **Sell Digital Soundpacks & Apparel:** Offer high-margin branded caps, hoodies, and drumkits with seamless M-Pesa & Diaspora Card checkout.
3. **Turn Live Virtual Tips On:** On average, creators earn 3.4x more when prompting live shoutouts and challenges during high-energy moments in their stream.
4. **Use Pulse Escrow:** Ensures guaranteed promoter payout before your team takes the stage.`,

    general_chat: `Habari! I am your KenyaOne Pulse AI Assistant. I can help you discover upcoming events across all 47 counties, find verified DJs and MCs, calculate festival production budgets, generate viral promo campaigns, or guide you through authentic Kenyan nightlife and cultural experiences. What would you like to explore today?`,
  };

  const selectedReply = fallbackReplies[task] || fallbackReplies.general_chat;
  return {
    success: true,
    reply: `${selectedReply}\n\n*(Powered by KenyaOne Entertainment Intelligence)*`,
    suggestedActions: [
      'Discover Events in Nairobi',
      'Check Pulse DJ Booth',
      'Explore 47 Counties Culture',
      'Book a Verified Artist',
    ],
  };
}
