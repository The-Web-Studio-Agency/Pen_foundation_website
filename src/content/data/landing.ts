/**
 * Copy for the /landing-page paid-traffic page.
 *
 * SOURCE: "PEN FOUNDATION (1).pdf", supplied by the client (November 2026).
 * Every heading, body line, figure and FAQ answer below is transcribed from
 * it, in its order. Nothing is paraphrased.
 *
 * One figure was marked up in the source: the installation time per point
 * reads "~2 Hours" highlighted red and "20-30 mins" highlighted green. The
 * green value is used for the figure. The FAQ answer, which the source left
 * unmarked, still says "approximately two hours". Reconcile the two with the
 * client before the ads go live.
 */

/** The number in the source, as dialled and as displayed. */
export const LANDING_PHONE = { display: '+91 73561 77577', tel: '+917356177577' };

export const landing = {
  hero: {
    kicker: 'PEN Foundation',
    title: 'A Faster, Smarter & More Sustainable Alternative to Conventional Foundations',
    sub: 'Build faster. Excavate less. Start construction sooner.',
    body: 'PEN Foundation is a patented Pre-Engineered Nail Foundation System designed for suitable low-rise construction.',
    emphasis: 'Pre-Engineered Nail Foundation System',
    points: 'Zero conventional excavation. No foundation curing. Installed in hours.',
    cta: 'Request a Project Assessment',
    call: 'Talk to an Engineer',
    trust: ['Patented System', 'Research Validated', 'Field Tested'],
  },

  why: {
    chip: 'Why PEN Foundation?',
    heading: 'A simpler way to build foundations.',
    body: [
      'Traditional foundations can involve excavation, reinforcement, concrete work and curing before construction can move forward.',
      'PEN Foundation uses a different approach — a pre-engineered foundation system designed to reduce excavation, site disturbance and waiting time.',
    ],
    items: [
      {
        icon: 'clock',
        title: 'Faster Installation',
        body: 'Foundation points can be installed in hours, depending on project and site conditions.',
      },
      {
        icon: 'shovel',
        title: 'Zero Conventional Excavation',
        body: 'No large-scale excavation or spoil removal is required.',
      },
      {
        icon: 'drop',
        title: 'No On-Site Foundation Curing',
        body: 'The system avoids the conventional on-site foundation curing cycle.',
      },
      {
        icon: 'leaf',
        title: 'Less Site Disturbance',
        body: 'Work with the existing ground while reducing excavation and disruption.',
      },
      {
        icon: 'cube',
        title: 'Less Concrete & Water',
        body: 'The system can significantly reduce concrete and water requirements compared with conventional RCC footings.',
      },
      {
        icon: 'ruler',
        title: 'Designed for the Project',
        body: "Foundation layout and installation are determined based on the project's structural and soil requirements.",
      },
    ],
  },

  enquiryTop: {
    chip: 'Is PEN right for your project?',
    heading: 'Tell us about your project.',
    body: [
      'Not every project is the same.',
      'Our engineering team can review your project and help determine whether PEN Foundation is suitable based on the building type, structural loads, soil conditions and site requirements.',
    ],
    formTitle: 'Project Enquiry',
    submit: 'Request Project Assessment',
    callPrompt: 'Prefer to speak directly with an engineer?',
    note: 'Our team will review your information and guide you on the next step.',
  },

  how: {
    chip: 'How PEN Foundation works',
    heading: 'One Node. Four Engineered Nails. A Smarter Foundation.',
    body: [
      'PEN Foundation uses a high-strength precast node connected to four engineered nails.',
      'The nails are driven into the qualified soil and work together with the surrounding soil to transfer structural loads.',
    ],
    steps: [
      {
        title: 'Position',
        body: 'The precast foundation node is positioned at the required foundation point.',
      },
      {
        title: 'Drive',
        body: 'Four engineered nails are driven into the soil at the specified angle.',
      },
      { title: 'Secure', body: 'The nails are grouted and the foundation point is completed.' },
      {
        title: 'Build',
        body: 'After installation and quality checks, the approved structure can connect to the foundation.',
      },
    ],
    tagline: 'Simple above the ground. Engineered below it.',
  },

  compare: {
    chip: 'PEN vs Conventional Foundation',
    heading: 'Less digging. Less waiting. Less site disruption.',
    columns: ['PEN Foundation', 'Conventional Foundation'],
    rows: [
      ['Installed in hours', 'Longer foundation cycle'],
      ['No conventional excavation', 'Excavation required'],
      ['No on-site foundation curing', 'Curing required'],
      ['Less site disturbance', 'Greater site disturbance'],
      ['Lower concrete requirement', 'Higher concrete requirement'],
      ['Lower water requirement', 'Higher water requirement'],
      ['Pre-engineered system', 'Conventional cast-in-place approach'],
      ['Suitable for selected low-rise projects', 'Widely used across project types'],
    ],
    closingLead: 'The idea is simple:',
    closing: 'Spend less time on the foundation and more time building.',
  },

  proof: {
    chip: 'Engineered. Tested. Field validated.',
    heading: 'Built on engineering, not just an idea.',
    body: 'PEN Foundation has been developed through research, testing and real-world project applications.',
    stats: [
      { value: '2.0–2.6×', label: 'Field-validated enhancement factor in soil bearing capacity' },
      { value: '20–30 mins', label: 'Indicative installation time per foundation point' },
      {
        value: '80%+',
        label:
          'Potential reduction in concrete compared with the referenced conventional RCC footing, subject to project design',
      },
      { value: 'NIT Calicut', label: 'Field testing and validation' },
    ],
    trustTitle: 'Trust & Recognition',
    trust: [
      'Patented foundation system',
      'Field tested at NIT Calicut',
      'Mentored by IIT Kanpur',
      'Listed by GRIHA',
      'Designed with applicable Indian Standards',
      'Real-world project deployments',
    ],
    disclaimer:
      'All performance figures are project-dependent and should be verified during engineering assessment.',
  },

  uses: {
    chip: 'Where can PEN be used?',
    heading: 'Designed for projects where speed and low site disturbance matter.',
    items: [
      {
        slug: 'residential',
        title: 'Residential',
        body: 'For suitable low-rise homes where a faster and less disruptive foundation process is preferred.',
      },
      {
        slug: 'commercial',
        title: 'Commercial',
        body: 'For selected commercial projects where reducing foundation-related delays can improve the construction timeline.',
      },
      {
        slug: 'eco-resorts-and-farmstays',
        title: 'Eco Resorts & Farmstays',
        body: 'For sites where protecting trees, terrain and the natural character of the land is important.',
      },
      {
        slug: 'modular-and-prefab',
        title: 'Modular & Prefabricated Buildings',
        body: 'A foundation approach that can complement fast and repeatable construction.',
      },
      {
        slug: 'low-span-industrial',
        title: 'Low-Span Industrial',
        body: 'For selected light industrial structures with repeated foundation points.',
      },
      {
        slug: 'ground-mounted-solar',
        title: 'Ground-Mounted Solar',
        body: 'For selected applications where faster installation and reduced site disturbance are important.',
      },
    ],
    note: 'Project suitability depends on structural loads, soil conditions and site requirements.',
  },

  projects: {
    chip: 'Real projects',
    heading: 'Already being used in real-world projects.',
    items: [
      {
        name: 'Black Langur Resort',
        place: 'Wayanad',
        body: 'An eco-sensitive, sloping site where conventional excavation could disturb the natural terrain.',
        result:
          'PEN helped reduce site disturbance while supporting the construction requirements.',
        image: {
          src: '/media/projects/black-langur/video_poster.jpg',
          alt: 'The Black Langur Resort site among trees in Wayanad',
        },
      },
      {
        name: 'Startup Eco-Ashram',
        place: 'Maharashtra',
        body: "PEN's first commercial-scale deployment outside Kerala.",
        result:
          'The project demonstrated the potential for repeatable foundation installation at commercial scale.',
        image: {
          src: '/media/images/homepage/startup-ecoashram.png',
          alt: 'A curved-roof pavilion raised on a light frame among trees',
        },
      },
      {
        name: 'Devagiri College Library',
        place: 'Kozhikode',
        body: 'An institutional project where minimising site disruption was important.',
        result:
          'The completed structure received the SSMB 2024 Best Commercial Steel Structure recognition.',
        image: {
          src: '/media/projects/devagiri/dsc00142.jpg',
          alt: 'The Devagiri College library tower lit at night',
        },
      },
      {
        name: 'Bethel Residency',
        place: 'Kozhikode',
        body: 'A low-rise residential project using the PEN Foundation system.',
        result: 'A real-world example of PEN being applied to residential construction.',
        // STAND-IN: no Bethel Residency photograph has been supplied yet.
        image: {
          src: '/media/images/brick-house.png',
          alt: 'A low-rise steel and masonry structure on PEN foundations',
        },
      },
      {
        name: 'Bengaluru Farmhouse',
        place: '',
        body: 'A remote project where construction speed and reduced site activity were important.',
        result:
          'PEN supported faster foundation installation with less dependence on excavation and wet work.',
        image: {
          src: '/media/images/homepage/Benglaru-Farmhouse.png',
          alt: 'A farmhouse in the Bengaluru region built on PEN foundations',
        },
      },
    ],
  },

  choose: {
    chip: 'Why choose PEN?',
    heading: "A foundation system built around today's construction needs.",
    items: [
      {
        title: 'Build Faster',
        body: 'Reduce the time spent waiting for conventional foundation work.',
      },
      { title: 'Excavate Less', body: 'Avoid large-scale excavation and spoil removal.' },
      {
        title: 'Disturb Less',
        body: 'Reduce disruption to the existing site, soil and surrounding environment.',
      },
      {
        title: 'Use Less',
        body: 'Potentially reduce concrete and water requirements compared with conventional footing designs.',
      },
      {
        title: 'Plan Better',
        body: 'A pre-engineered system allows foundation points to be designed and prepared according to project requirements.',
      },
      {
        title: 'Build With Confidence',
        body: 'Backed by research, testing, engineering and real-world applications.',
      },
    ],
  },

  process: {
    chip: 'From project to foundation',
    heading: 'A simple four-step process.',
    steps: [
      {
        title: 'Project Assessment',
        body: 'Share your building type, location, structural information and available soil data.',
      },
      {
        title: 'Engineering',
        body: 'Our team evaluates the project and develops the appropriate foundation design.',
      },
      {
        title: 'Installation',
        body: 'The foundation nodes and engineered nails are installed according to the approved design.',
      },
      {
        title: 'Construction',
        body: 'After installation and quality checks, construction can proceed as planned.',
      },
    ],
  },

  faq: {
    chip: 'FAQ',
    heading: 'Frequently asked questions',
    entries: [
      {
        question: 'What is PEN Foundation?',
        answer:
          'PEN Foundation is a patented Pre-Engineered Nail Foundation System using a precast foundation node and four engineered nails to transfer structural loads into the surrounding soil.',
      },
      {
        question: 'How is PEN different from a conventional foundation?',
        answer:
          'Conventional foundations generally involve excavation, reinforcement, concrete casting and curing. PEN is designed to avoid conventional excavation and the on-site foundation curing cycle.',
      },
      {
        question: 'How long does installation take?',
        answer:
          'A foundation point can typically be installed in approximately two hours, depending on the project and site conditions.',
      },
      {
        question: 'Does PEN require excavation?',
        answer:
          'No. PEN is designed to be installed without conventional excavation, helping reduce soil disturbance and spoil removal.',
      },
      {
        question: 'Is PEN suitable for every building?',
        answer:
          'No. PEN is designed for suitable low-rise structures. Each project needs to be assessed based on soil conditions, structural loads and site requirements.',
      },
      {
        question: 'Has PEN been tested?',
        answer:
          'Yes. The system has undergone testing and field validation, including work at NIT Calicut.',
      },
      {
        question: 'Is PEN suitable for permanent structures?',
        answer:
          "PEN is designed for suitable permanent structures when properly engineered and specified for the project. Final suitability depends on the project's structural and geotechnical conditions.",
      },
      {
        question: 'How do I know if my project is suitable?',
        answer:
          'Share your project details, drawings and available soil information. Our engineering team can review them and advise you on the next step.',
      },
    ],
  },

  enquiryBottom: {
    chip: 'Ready to explore PEN for your project?',
    heading: 'Tell us about your project.',
    body: [
      "If you're planning a new project and want to explore a faster, less disruptive foundation option, talk to our team.",
    ],
    formTitle: 'Project Enquiry',
    submit: 'Request a Project Assessment',
    callPrompt: 'Or speak directly with our team',
    note: "We'll review your requirement and guide you on the next step.",
  },

  closing: {
    heading: 'Build faster. Disturb less.',
    sub: 'A smarter foundation for modern construction.',
    name: 'PEN Foundation',
    descriptor: 'Patented Pre-Engineered Nail Foundation System',
    cta: 'Request a Project Assessment',
    slogan: 'From soil we rise. Faster. Stronger. Greener.',
  },

  /** The enquiry form, as laid out in the source. */
  form: {
    fields: {
      name: { label: 'Full Name', placeholder: 'Enter your name' },
      phone: { label: 'Phone Number', placeholder: '+91 XXXXX XXXXX' },
      email: { label: 'Email', placeholder: 'Enter your email' },
      location: { label: 'Project Location', placeholder: 'Enter location' },
      type: { label: 'Project Type', placeholder: 'Select project type' },
      message: {
        label: 'Tell us about your project',
        placeholder: 'Briefly describe your requirement',
      },
    },
    types: ['Residential', 'Commercial', 'Resort', 'Industrial', 'Other'],
  },
};

export type LandingEnquiry = typeof landing.enquiryTop;
