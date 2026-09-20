import { StoryLesson } from '../types';

export const mockStoryLessons: StoryLesson[] = [
  {
    id: 'story_http_01',
    levelId: 'lvl_05',
    levelNumber: 5,
    levelTitle: 'Make It Talk',
    title: 'The Website That Couldn’t Talk',
    roleContext: 'Junior Frontend Engineer at "ChaiPay" (Fintech Startup, Bengaluru)',
    narrative: {
      premise: 'You just joined ChaiPay, a fast-moving fintech startup. Your first Monday morning assignment sounds deceptive: "Make our checkout page talk to the payment gateway."',
      dilemma: 'There is only one problem. The entire engineering team is arguing about why the user sees a blank white screen. The intern blames the CSS, the backend lead blames the DNS, and nobody has traced what actually travels across the wire.',
      objective: 'Step inside the network wire. Follow a single keystroke from the address bar to the server and back to bring ChaiPay to life.',
    },
    interactiveMoment: {
      prompt: 'Arrange the 5 critical stages of a Web Request in exact chronological order to bridge the Browser and the Server:',
      correctOrder: [
        '1. Browser looks up IP via DNS Resolver',
        '2. TCP Handshake establishes secure socket',
        '3. Browser transmits HTTP GET /checkout request',
        '4. Server processes request & returns 200 OK + HTML',
        '5. Browser renders DOM & triggers CSS layout paint',
      ],
      initialItems: [
        '3. Browser transmits HTTP GET /checkout request',
        '1. Browser looks up IP via DNS Resolver',
        '5. Browser renders DOM & triggers CSS layout paint',
        '2. TCP Handshake establishes secure socket',
        '4. Server processes request & returns 200 OK + HTML',
      ],
      hints: [
        'Think: Before the browser can send an HTTP letter, it needs the postal address (IP).',
        'Before data flows, a secure phone call (TCP Handshake) must be answered.',
        'Rendering the DOM only happens after the browser receives the HTML payload.',
      ],
      explanationAfterSuccess: 'Boom! You just connected the wire. The DNS found the IP, the TCP handshake verified the line, HTTP delivered the envelope, and the browser turned raw bytes into a living UI.',
    },
    conceptBreakdown: {
      title: 'WHAT JUST HAPPENED? — The Anatomy of an HTTP Exchange',
      summary: 'HTTP (Hypertext Transfer Protocol) is the universal conversation language of the internet. The client speaks in Requests (GET, POST, PUT, DELETE), and the server answers in Responses with Status Codes (200, 404, 500) and Payloads.',
      realWorldAnalogy: {
        title: 'The Irani Chai Cafe Analogy ☕',
        story: 'Imagine walking into a famous Hyderabad Irani cafe. You don’t walk straight into the kitchen. You check the board for the table number (DNS lookup). You tell the waiter "Ek Chai aur do Bun Maska" (HTTP GET Request). The kitchen prepares it (Server execution). The waiter brings your plate with a nod (Status 200 OK Response). If they ran out of Maska, the waiter says "Khatam ho gaya" (Status 404 Not Found)!',
        icon: '☕',
      },
      visualDiagramFlow: [
        {
          step: 1,
          actor: 'Client (Browser)',
          action: 'DNS Resolution',
          desc: 'Converts "chaipay.in" → "104.21.48.192" via recursive DNS servers.',
        },
        {
          step: 2,
          actor: 'Network Socket',
          action: 'TCP/TLS Handshake',
          desc: 'SYN → SYN-ACK → ACK to establish encrypted TLS 1.3 tunnel.',
        },
        {
          step: 3,
          actor: 'Browser Engine',
          action: 'HTTP GET Dispatch',
          desc: 'Sends Headers (Host, Accept, User-Agent, Authorization Cookie).',
        },
        {
          step: 4,
          actor: 'ChaiPay Server',
          action: 'Process & Return 200',
          desc: 'Validates session, queries PostgreSQL, and streams HTML/JSON.',
        },
        {
          step: 5,
          actor: 'Rendering Engine',
          action: 'Critical Rendering Path',
          desc: 'Parses HTML into DOM Tree, applies CSSOM, and Paints pixels.',
        },
      ],
      commonMistakes: [
        'Mistake 1: Believing DNS stores the actual website files (DNS only stores phonebook IP records).',
        'Mistake 2: Thinking HTTP POST is automatically encrypted without HTTPS (Always enforce TLS!).',
        'Mistake 3: Confusing 401 Unauthorized (unauthenticated) with 403 Forbidden (authenticated, but lack permissions).',
      ],
      goldenRule: 'Clients ask (Requests) with Methods and Headers; Servers answer (Responses) with Status Codes and Bodies. The web is stateless by default.',
    },
    miniChallenge: {
      question: 'A user on a slow 3G mobile network in Jaipur clicks "Pay ₹250". The network drops for 3 seconds, and the user taps the button three more times in frustration. What HTTP design pattern prevents them from being charged ₹1,000?',
      context: 'Payment Gateways & Idempotency in Real-World Distributed Systems',
      options: [
        {
          id: 'opt_a',
          label: 'Change the HTTP method from POST to GET',
          isCorrect: false,
          feedback: 'GET requests should never modify state or trigger financial transactions!',
        },
        {
          id: 'opt_b',
          label: 'Attach a unique "Idempotency-Key" header with each checkout session',
          isCorrect: true,
          feedback: 'Yep. That’s exactly what happens at Razorpay, Stripe and ChaiPay! 🔥 The server recognizes duplicate requests with the same key and only charges once.',
        },
        {
          id: 'opt_c',
          label: 'Disable JavaScript on mobile browsers',
          isCorrect: false,
          feedback: 'Disabling JavaScript would break the entire modern web application!',
        },
        {
          id: 'opt_d',
          label: 'Send a 500 Internal Server Error immediately on second click',
          isCorrect: false,
          feedback: 'That scares the user and doesn’t cleanly deduplicate the transaction in the database.',
        },
      ],
      correctFeedback: '🎯 Spot on! An Idempotency Key guarantees that identical retries produce the exact same outcome without duplicate side effects.',
      incorrectFeedback: 'Almost! Think about what unique identifier allows a backend to identify identical retries.',
    },
    practiceTask: {
      title: 'Now Use It: Fetch ChaiPay Merchant Status',
      description: 'Write a modern JavaScript `fetch()` call to retrieve live store status with error handling for non-200 HTTP codes.',
      problemType: 'coding',
      starterSnippet: `// 🚀 Challenge: Complete the async fetch function
async function checkMerchantStatus(merchantId) {
  try {
    const response = await fetch(\`https://api.chaipay.in/v1/merchants/\${merchantId}\`);
    
    // Check if response was not OK (e.g. 404, 500)
    if (!response.ok) {
      throw new Error(\`HTTP Error: \${response.status}\`);
    }
    
    const data = await response.json();
    return { success: true, isLive: data.active };
  } catch (err) {
    return { success: false, error: err.message };
  }
}`,
      hint: 'Always check response.ok before parsing response.json(), because fetch() does NOT reject on 404/500!',
      externalLinkText: 'Test in JS Playground ↗',
      externalLinkUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch',
    },
  },
  {
    id: 'story_grid_02',
    levelId: 'lvl_03',
    levelNumber: 3,
    levelTitle: 'Make It Beautiful',
    title: 'The Responsive Metamorphosis',
    roleContext: 'UI Architect at "SwagBazaar" (Student Merch Platform, Pune)',
    narrative: {
      premise: 'SwagBazaar is preparing for the biggest annual college fest sale across 50 engineering colleges.',
      dilemma: 'The current layout uses absolute pixel positioning. On an iPhone 13, all college hoodie cards clip off screen; on a library desktop monitor, everything is stretched into a bizarre thin noodle.',
      objective: 'Master CSS Grid and Flexbox to build a layout that naturally morphs to any screen size without writing 50 media queries.',
    },
    interactiveMoment: {
      prompt: 'Arrange the CSS Grid rules from parent definition to child placement:',
      correctOrder: [
        '1. display: grid;',
        '2. grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));',
        '3. gap: 1.5rem;',
        '4. align-items: stretch;',
      ],
      initialItems: [
        '3. gap: 1.5rem;',
        '1. display: grid;',
        '4. align-items: stretch;',
        '2. grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));',
      ],
      hints: [
        'First turn the container into a grid context.',
        'Then declare dynamic repeating responsive columns with minmax().',
        'Add spacing between tracks with gap.',
      ],
      explanationAfterSuccess: 'Perfection! With `repeat(auto-fit, minmax(280px, 1fr))`, cards reflow from 4 columns on desktop down to 1 column on mobile seamlessly!',
    },
    conceptBreakdown: {
      title: 'WHAT JUST HAPPENED? — 1D vs 2D Layout Geometry',
      summary: 'Flexbox is designed for 1-dimensional layouts (rows OR columns). CSS Grid is designed for 2-dimensional layouts (rows AND columns simultaneously).',
      realWorldAnalogy: {
        title: 'The College Fest Stall Arrangement 🎪',
        story: 'Flexbox is like queuing up students in a single line at the ticket counter. CSS Grid is like laying out the entire fest ground with designated stalls in rows and columns!',
        icon: '🎪',
      },
      visualDiagramFlow: [
        {
          step: 1,
          actor: 'Grid Container',
          action: 'Establish Tracks',
          desc: 'Defines vertical column tracks and horizontal row tracks.',
        },
        {
          step: 2,
          actor: 'auto-fit Keyword',
          action: 'Calculate Max Columns',
          desc: 'Fits as many 280px tracks as the viewport width allows.',
        },
        {
          step: 3,
          actor: '1fr Unit',
          action: 'Distribute Remainder',
          desc: 'Expands cards to absorb all remaining fractional space.',
        },
      ],
      commonMistakes: [
        'Mistake 1: Trying to use 10 nested Flexbox wrappers when a single 2D CSS Grid is cleaner.',
        'Mistake 2: Hardcoding width: 300px instead of minmax(250px, 1fr).',
      ],
      goldenRule: 'Use Flexbox for component internals (navbars, button icons). Use CSS Grid for macro page layouts and product card matrices.',
    },
    miniChallenge: {
      question: 'Which CSS property allows a card inside a Grid to span across 2 columns on wide screens?',
      context: 'CSS Grid Item Placement',
      options: [
        {
          id: 'grid_a',
          label: 'grid-column: span 2;',
          isCorrect: true,
          feedback: 'Correct! "grid-column: span 2" makes the hero card twice as wide as regular grid items.',
        },
        {
          id: 'grid_b',
          label: 'column-width: 200%;',
          isCorrect: false,
          feedback: 'column-width is for CSS multi-column text, not CSS Grid item placement.',
        },
        {
          id: 'grid_c',
          label: 'flex-grow: 2;',
          isCorrect: false,
          feedback: 'flex-grow only applies inside Flex containers, not CSS Grid!',
        },
      ],
      correctFeedback: '🌟 Excellent! Grid placement rules let you create editorial magazine layouts with zero hassle.',
      incorrectFeedback: 'Try again! Check the grid-column syntax.',
    },
    practiceTask: {
      title: 'Now Use It: Responsive Bento Card Grid',
      description: 'Build a 3-card bento grid with 1 feature card spanning 2 columns.',
      problemType: 'coding',
      starterSnippet: `.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}
.bento-hero-card {
  grid-column: span 2;
}`,
      hint: 'Add a media query so on mobile (max-width: 640px) the hero card reverts to span 1.',
      externalLinkText: 'Open CSS Tricks Grid Guide ↗',
      externalLinkUrl: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
    },
  },
];
