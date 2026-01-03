import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("Generate itinerary function started");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { tripName, destination, startDate, endDate, budget, description } = body;
    
    console.log("Request received:", { tripName, destination, startDate, endDate, budget, description });
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is missing");
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Comprehensive list of Indian destinations
    const destinations = [
      'jaipur', 'delhi', 'mumbai', 'goa', 'kerala', 'varanasi', 'agra', 'udaipur',
      'manali', 'shimla', 'ladakh', 'darjeeling', 'ooty', 'mysore', 'hyderabad',
      'chennai', 'kolkata', 'bengaluru', 'bangalore', 'pune', 'rajasthan', 'kashmir',
      'rishikesh', 'haridwar', 'amritsar', 'jaisalmer', 'jodhpur', 'pushkar',
      'hampi', 'kodaikanal', 'munnar', 'alleppey', 'kovalam', 'kochi',
      'andhra', 'arunachal', 'assam', 'bihar', 'chhattisgarh', 'gujarat', 'haryana',
      'himachal', 'jharkhand', 'karnataka', 'madhya pradesh', 'maharashtra',
      'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab', 'sikkim',
      'tamil nadu', 'telangana', 'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal',
      'gangtok', 'shillong', 'imphal', 'kohima', 'aizawl', 'agartala',
      'leh', 'srinagar', 'gulmarg', 'pahalgam', 'nainital', 'mussoorie',
      'lonavala', 'mahabaleshwar', 'coorg', 'wayanad', 'thekkady', 'pondicherry',
      'madurai', 'thanjavur', 'rameswaram', 'kanyakumari', 'tirupati', 'vizag',
      'konark', 'puri', 'bhubaneswar', 'khajuraho', 'orchha', 'ujjain', 'bhopal',
      'mount abu', 'kutch', 'rann', 'dwarka', 'somnath', 'ahmedabad', 'nashik', 'shirdi', 
      'andaman', 'lakshadweep', 'spiti', 'kasol', 'dharamshala', 'mcleodganj',
      'lucknow', 'ayodhya', 'mathura', 'vrindavan', 'bodhgaya', 'nalanda', 'rajgir',
      'guwahati', 'kaziranga', 'majuli', 'tawang', 'ziro', 'cherrapunji', 'dawki'
    ];
    
    // Find destination from trip name and description
    const combinedText = `${tripName || ''} ${description || ''}`.toLowerCase();
    let inferredDestination = destination;
    
    if (!inferredDestination) {
      for (const dest of destinations) {
        if (combinedText.includes(dest)) {
          inferredDestination = dest.charAt(0).toUpperCase() + dest.slice(1);
          break;
        }
      }
      if (!inferredDestination) {
        // Use the trip name as destination
        inferredDestination = tripName || 'Delhi';
      }
    }
    
    console.log("Destination identified:", inferredDestination);

    // Calculate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const totalBudget = budget || days * 3000;
    const budgetPerDay = Math.floor(totalBudget / days);
    
    console.log("Trip days:", days, "Budget per day:", budgetPerDay, "Total budget:", totalBudget);

    const prompt = `You are a travel expert. Create a detailed ${days}-day travel itinerary for ${inferredDestination}, India.

IMPORTANT: Return ONLY a valid JSON array with NO additional text, NO markdown, NO explanation. The response must start with [ and end with ]

Budget: ₹${budgetPerDay} per day (Total: ₹${totalBudget})

JSON Format Required:
[
  {
    "day": 1,
    "activities": [
      {
        "time": "6:00 AM",
        "title": "Activity name",
        "description": "Brief description of the activity",
        "location": "Specific location name",
        "cost": 100,
        "duration": 90,
        "category": "sightseeing"
      }
    ]
  }
]

Requirements:
- Create exactly ${days} day objects in the array
- Each day must have 5-6 activities from early morning (6 AM) to night (10 PM)
- Include local breakfast, lunch, dinner spots with authentic cuisine
- Include famous tourist attractions and hidden gems
- Include transportation between locations
- Categories: sightseeing, food, transport, accommodation, shopping, adventure, cultural
- All costs in Indian Rupees (INR) as numbers without currency symbol
- Be specific with location names
- Keep within budget

Generate the itinerary now:`;

    console.log("Calling AI API with prompt length:", prompt.length);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("Request timeout - aborting");
      controller.abort();
    }, 50000);
    
    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { 
              role: "system", 
              content: "You are a travel itinerary generator. You ONLY respond with valid JSON arrays. Never include markdown, explanations, or any text outside the JSON array." 
            },
            { role: "user", content: prompt },
          ],
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log("AI response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI API error:", response.status, errorText);
        
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        throw new Error(`AI service error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("AI response received");
      
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        console.error("Empty AI response:", JSON.stringify(data));
        throw new Error("Empty response from AI");
      }

      console.log("Raw AI response length:", content.length);
      console.log("Raw AI response preview:", content.substring(0, 500));

      // Parse JSON from response
      let itinerary;
      let jsonString = content.trim();
      
      // Remove markdown code blocks if present
      if (jsonString.includes('```')) {
        const match = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (match) {
          jsonString = match[1].trim();
        }
      }
      
      // Find the JSON array
      const startIdx = jsonString.indexOf('[');
      const endIdx = jsonString.lastIndexOf(']');
      
      if (startIdx !== -1 && endIdx > startIdx) {
        jsonString = jsonString.substring(startIdx, endIdx + 1);
      }
      
      console.log("Extracted JSON length:", jsonString.length);
      
      try {
        itinerary = JSON.parse(jsonString);
        console.log("Successfully parsed itinerary with", itinerary.length, "days");
        
        // Validate structure
        if (!Array.isArray(itinerary)) {
          throw new Error("Response is not an array");
        }
        
        // Ensure each day has the correct structure
        itinerary = itinerary.map((day: any, index: number) => ({
          day: day.day || index + 1,
          activities: Array.isArray(day.activities) ? day.activities.map((act: any) => ({
            time: act.time || "9:00 AM",
            title: act.title || "Activity",
            description: act.description || "",
            location: act.location || inferredDestination,
            cost: typeof act.cost === 'number' ? act.cost : parseInt(act.cost) || 0,
            duration: typeof act.duration === 'number' ? act.duration : parseInt(act.duration) || 60,
            category: act.category || "activity"
          })) : []
        }));
        
        console.log("Validated itinerary structure");
        
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Failed JSON string:", jsonString.substring(0, 1000));
        throw new Error("Failed to parse AI response as JSON");
      }

      return new Response(JSON.stringify({ itinerary }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      console.error("Fetch error:", fetchError);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return new Response(JSON.stringify({ error: "Request timed out. Please try again." }), {
          status: 504,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw fetchError;
    }

  } catch (error: unknown) {
    console.error("Function error:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
