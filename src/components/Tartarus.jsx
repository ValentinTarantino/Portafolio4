const Tartarus = () => (
  <svg
    className="dark-hour-scene__tartarus"
    viewBox="0 0 420 900"
    preserveAspectRatio="xMidYMax meet"
    focusable="false"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="tartarus-shell" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#06130d" />
        <stop offset="0.32" stopColor="#0b2416" />
        <stop offset="0.58" stopColor="#12351f" />
        <stop offset="1" stopColor="#040d09" />
      </linearGradient>
      <linearGradient id="tartarus-side" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#176b4a" stopOpacity="0.58" />
        <stop offset="0.42" stopColor="#0d3826" stopOpacity="0.44" />
        <stop offset="1" stopColor="#020907" stopOpacity="0.84" />
      </linearGradient>
      <linearGradient id="tartarus-light" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#b8ffe4" stopOpacity="0.98" />
        <stop offset="0.36" stopColor="#00ff91" stopOpacity="0.96" />
        <stop offset="1" stopColor="#16a95c" stopOpacity="0.7" />
      </linearGradient>
      <radialGradient id="tartarus-core" cx="30%" cy="25%" r="78%">
        <stop offset="0" stopColor="#c8ffff" />
        <stop offset="0.32" stopColor="#72efff" />
        <stop offset="0.74" stopColor="#20ddeb" />
        <stop offset="1" stopColor="#159eac" />
      </radialGradient>
    </defs>

    {/* The outer profile keeps the same crown and footing, with large offset shoulders. */}
    <path
      d="M100 900V811H78V766H48V722H77V689H63V636H91V600H76V553H103V518H82V470H111V429H91V389H119V349H102V312H132V277H154V235H174V196H190V151H205V104H214V59H226V29H240V80H254V118H270V159H291V190H321V219H350V273H330V300H365V344H342V384H369V426H341V466H360V509H329V552H355V594H329V631H355V675H327V722H347V766H321V811H310V900Z"
      fill="url(#tartarus-shell)"
      stroke="#176b4a"
      strokeOpacity="0.52"
      strokeWidth="1.5"
    />

    {/* Rear wings sit behind the continuous spine and give the tower its broad shoulders. */}
    <g stroke="#176b4a" strokeOpacity="0.34" strokeWidth="1.6">
      <path d="M118 337H151V315H173V344H190V373H177V415H156V435H121V411H103V370H118Z" fill="#0b2a20" />
      <path d="M260 196H294V215H330V257H347V282H321V312H283V292H264V256H250V225H260Z" fill="#0b2a20" />
      <path d="M280 387H307V405H339V439H357V470H331V499H293V477H274V443H286Z" fill="#0a261d" />
      <path d="M101 521H134V540H159V569H177V609H154V645H119V661H91V634H76V587H94V552H101Z" fill="#0b2a20" />
      <path d="M296 563H328V544H350V577H365V620H346V659H326V699H293V676H278V639H296Z" fill="#0a261d" />
    </g>

    {/* Each wing gets a distinct face and recessed interior, rather than an empty dark block. */}
    <g>
      {/* Mid-left: a recessed service hall with a lit front pier and a deep inner bay. */}
      <path d="M114 337H143V349H158V377H151V410H128V398H112V371H120V354H114Z" fill="#123a29" fillOpacity="0.88" />
      <path d="M151 347H170V363H184V399H174V416H155V396H164V376H151Z" fill="#061b15" fillOpacity="0.92" />
      <path d="M121 355H136V378H146V396H136V389H126V378H121Z" fill="#020b09" fillOpacity="0.94" />
      <path d="M145 350H151V392H146Z" fill="#176b4a" fillOpacity="0.66" />

      {/* Upper-right: a narrow annex wraps around a deep vertical shaft. */}
      <path d="M291 214H322V224H337V240H346V269H334V289H306V276H316V258H301V245H291Z" fill="#15412e" fillOpacity="0.88" />
      <path d="M322 224H337V240H346V270H335V257H327V244H322Z" fill="#061b15" fillOpacity="0.96" />
      <path d="M301 230H315V247H328V262H319V255H309V247H301Z" fill="#020b09" fillOpacity="0.96" />
      <path d="M315 265H334V272H326V282H307V276H315Z" fill="#0b2a20" stroke="#176b4a" strokeOpacity="0.48" strokeWidth="1.2" />

      {/* Mid-right: a cantilevered relay block, with a recessed opening and two supports. */}
      <path d="M302 405H328V416H344V439H354V464H337V478H309V464H320V443H309V428H302Z" fill="#123a29" fillOpacity="0.84" />
      <path d="M328 416H342V438H352V463H339V450H344V437H328Z" fill="#061b15" fillOpacity="0.94" />
      <path d="M310 429H323V447H333V463H324V455H315V447H310Z" fill="#020b09" fillOpacity="0.94" />
      <path d="M304 468H339V476H328V483H312V477H304Z" fill="#0b2a20" stroke="#176b4a" strokeOpacity="0.46" strokeWidth="1.2" />

      <path d="M100 554H128V574H145V605H130V634H105V617H88V585H100Z" fill="#103c2c" fillOpacity="0.78" />
      <path d="M133 561H153V580H167V606H151V623H136V604H145V584H133Z" fill="#061b15" fillOpacity="0.86" />
      <path d="M91 589H111V608H121V633H98V617H84V600Z" fill="#020b09" fillOpacity="0.82" />
      <path d="M102 558H121V574H137V601H127V621H112V607H118V588H102Z" fill="#153b2b" fillOpacity="0.76" />
      <path d="M105 567H113V584H122V601H113V592H105Z" fill="#020b09" fillOpacity="0.94" />
      <path d="M130 579H139V603H133V613H127V599H132Z" fill="#061a13" />

      <path d="M302 577H329V600H346V629H331V656H310V638H319V613H302Z" fill="#103c2c" fillOpacity="0.68" />
      <path d="M329 577H344V600H357V623H344V645H331V627H340V605H329Z" fill="#061b15" fillOpacity="0.9" />
      <path d="M285 625H306V647H315V672H294V654H281V640Z" fill="#020b09" fillOpacity="0.82" />
    </g>

    {/* The central spine overlaps rear wings to establish a clear middle plane. */}
    <path d="M184 205H262V286H281V329H263V373H291V416H267V460H298V505H278V548H300V594H282V638H305V682H286V725H306V766H285V808H265V900H154V808H135V766H155V725H137V682H160V638H143V594H164V548H148V505H169V460H153V416H174V373H164V329H180V286H170V247H184Z" fill="#0c2518" fillOpacity="0.9" />
    <path d="M213 111H247V166H262V211H238V286H260V329H241V373H267V416H246V460H270V505H250V548H269V594H249V638H272V682H251V725H270V766H248V808H264V900H222V808H218V766H220V725H214V682H220V638H213V594H220V548H215V505H221V460H216V416H222V373H215V329H221V286H215V211H222V166H213Z" fill="url(#tartarus-side)" />

    {/* Recesses, vertical bays, and cross-members articulate the wing facades. */}
    <g fill="#020b09" fillOpacity="0.9">
      <path d="M124 348H130V367H124ZM139 342H144V361H139ZM162 354H167V370H162Z" />
      <path d="M303 229H309V247H303ZM318 237H323V253H318ZM333 271H338V284H333Z" />
      <path d="M315 419H321V438H315ZM331 443H336V460H331ZM292 454H298V470H292Z" />
      <path d="M105 565H111V582H105ZM122 574H128V596H122ZM143 588H149V603H143Z" />
      <path d="M308 587H314V605H308ZM326 600H332V622H326ZM339 634H345V650H339Z" />
    </g>
    <g fill="none" stroke="#176b4a" strokeOpacity="0.4" strokeWidth="1.6">
      <path d="M110 367H151V374H176M117 405H151M273 250H300V258H337M290 286H319M293 433H317V441H347M284 474H314" />
      <path d="M92 579H123V587H158M99 624H132M291 611H321V619H350M291 662H320" />
    </g>

    {/* Distinct connectors tie the energy sockets into the surrounding wings. */}
    <g fill="none" stroke="#176b4a" strokeWidth="3">
      <path d="M214 181V165H235V181M205 205H196V218H180" />
      <path d="M161 396H145V389H132M197 400H208V411H222" />
      <path d="M280 523H296V516H311M256 537H244V546H231" stroke="#168c7b" strokeOpacity="0.48" />
      <path d="M147 664V650H132V640M171 687H187V699H204" />
    </g>

    {/* Offset vertical annexes and short links break up the repeated floor rhythm. */}
    <g fill="#0a2118" stroke="#176b4a" strokeOpacity="0.46" strokeWidth="1.4">
      <path d="M259 213H275V231H286V281H271V298H256V265H265V244H259Z" strokeOpacity="0.38" fill="#0b241a" />
      <path d="M151 319H169V337H181V371H163V392H148V365H157V348H151Z" />
      <path d="M282 386H299V408H316V433H296V454H280V429H289V414H282Z" />
      <path d="M116 568H137V584H151V610H132V632H115V601H124V589H116Z" />
      <path d="M281 603H300V622H314V650H292V671H278V641H289V626H281Z" />
      <path d="M163 748H179V772H198V789H178V808H160V780H170V768H163Z" />
    </g>
    <g fill="none" stroke="#36d99a" strokeOpacity="0.38" strokeWidth="1.8">
      <path d="M246 231H264M169 356H184M267 420H289M137 594H158M265 631H291M177 777H202" />
      <path d="M270 231V278M160 337V367M294 408V442M129 584V615M294 622V654M174 772V798" />
    </g>

    {/* Uneven annexes are joined to the spine by enclosed bridges, not loose shards. */}
    <g fill="#0b1b12" stroke="#36d99a" strokeOpacity="0.38" strokeWidth="1.4">
      <path d="M107 411H160V419H145V432H127V421H107Z" />
      <path d="M298 416H324V425H316V447H309V461H300V442H307V430H298Z" />
      <path d="M106 505H148V517H125V548H106Z" />
      <path d="M300 548H349V562H328V592H329V594H300Z" />
      <path d="M112 636H143V650H125V682H112Z" />
      <path d="M305 638H360V653H337V682H305Z" />
      <path d="M105 722H137V735H120V764H105Z" />
      <path d="M306 725H355V739H330V766H306Z" />
      <path d="M165 300H130V278H151V286H165Z" />
      <path d="M276 249H310V266H289V287H276Z" strokeOpacity="0.3" />
    </g>

    {/* A few transfer decks remain; large masses carry most of the architecture. */}
    <g fill="#09251b" stroke="#36d99a" strokeOpacity="0.34" strokeWidth="1.5">
      <path d="M170 242H278V251H265V258H182V252H170Z" />
      <path d="M140 365H303V376H282V383H161V376H140Z" />
      <path d="M119 451H196V458H181V470H151V462H119Z" />
      <path d="M278 438H340V448H326V465H291V458H278Z" />
      <path d="M103 542H161V551H145V562H124V553H103Z" />
      <path d="M251 617H363V629H342V638H273V630H251Z" />
      <path d="M76 715H187V726H164V735H103V727H76Z" />
      <path d="M84 800H176V811H153V820H106V812H84Z" />
    </g>

    {/* Selective structural seams describe the large connected faces. */}
    <g fill="none" stroke="#36d99a" strokeOpacity="0.28" strokeWidth="1.4">
      <path d="M184 205H250M174 373H191M267 373H291M153 460H181M286 456H312M139 548H157M273 630H337M105 725H164M106 812H153" />
      <path d="M198 157V205M184 247V286M174 329V373M154 416V451M267 416V445M139 505V542M278 505V531M124 594V629M282 594V617M112 682V715M286 682V715" />
      <path d="M205 119V157M239 166V205M191 286V329M246 286V329M181 373V416M251 373V416M177 460V505M246 460V505M169 548V594M245 548V594M161 638V682M246 638V682M154 725V766M244 725V766" />
    </g>

    {/* Sparse braces connect the wings back to the central frame. */}
    <g fill="none" stroke="#36d99a" strokeOpacity="0.36" strokeWidth="1.8">
      <path d="M154 420H176M267 426H300M148 510H169M278 516H318M143 642H160M272 648H305M137 729H155M270 735H306M117 419V435L127 428M145 419V431L137 438M311 478V494L321 486M332 476V490H342" />
      <path d="M160 424V450M291 429V455M153 514V541M301 560V588M155 646V675M293 651V677M149 733V759M296 742V764" />
    </g>

    {/* Crown and antennae rise from the same central frame. */}
    <g fill="#08150f" stroke="#36d99a" strokeOpacity="0.54" strokeWidth="1.3">
      <path d="M207 112V61H216V35H229V61H237V119H222V93H217V119Z" />
      <path d="M197 127H211V151H190V139H197ZM239 130H257V151H245V164H235Z" />
      <path d="M178 228H195V241H171V235ZM261 218H282V232H270V244H257Z" />
      <path d="M148 391H166V403H138V397ZM285 383H308V396H295V408H278Z" />
      <path d="M118 577H143V590H127V603H111ZM302 579H333V592H316V604H296Z" />
      <path d="M105 672H129V686H113V697H99ZM310 674H342V687H325V700H304Z" />
    </g>

    {/* Small, irregular window groups sit on the faces of the major volumes. */}
    <g fill="url(#tartarus-light)">
      <path d="M205 136h3v10h-3zm31 16h3v8h-3zm-43 67h4v11h-4zm43 35h3v9h-3z" />
      <path d="M185 302h4v12h-4zm32 16h3v9h-3zm36 29h4v12h-4zm-70 43h3v8h-3z" />
      <path d="M165 429h4v12h-4zm42 15h3v9h-3zm55 18h4v11h-4zm-88 45h3v8h-3z" />
      <path d="M154 520h4v12h-4zm34 18h3v8h-3zm76 28h4v12h-4zm-99 47h3v9h-3z" />
      <path d="M138 609h4v11h-4zm51 17h3v9h-3zm92 25h4v12h-4zm-116 48h3v9h-3z" />
      <path d="M126 695h4v12h-4zm48 20h3v9h-3zm114 22h4v12h-4zm-144 49h3v9h-3z" />
    </g>
    <g fill="#00ff91" fillOpacity="0.98">
      <path d="M224 75h4v13h-4zm-72 363h4v10h-4zm159 117h4v11h-4zm-197 99h4v12h-4zm237 81h4v10h-4z" />
    </g>
    <g fill="#b8ffe4" fillOpacity="0.96">
      <path d="M228 46h3v8h-3zm-56 373h3v7h-3zm150 151h3v8h-3zm-207 93h3v8h-3z" />
    </g>

    {/* Four contained energy cores sit in framed sockets at staggered heights. */}
    <g fill="#071a16" stroke="#159eac" strokeOpacity="0.72" strokeWidth="1.7">
      <path d="M211 179H238V185H245V195H240V212H233V219H213V212H205V190H211Z" />
      <path d="M162 376H176V371H193V379H201V391H196V412H186V418H168V411H159V394H165V386H162Z" />
      <path d="M252 511H273V516H286V526H296V533H286V543H276V550H253V543H246V519H252Z" />
      <path d="M143 657H153V652H169V660H180V672H187V681H177V692H165V700H145V693H137V669H143Z" />
    </g>
    <g>
      <circle cx="226" cy="200" r="17" fill="#20ddeb" fillOpacity="0.14" />
      <circle cx="182" cy="396" r="16" fill="#20ddeb" fillOpacity="0.14" />
      <circle cx="268" cy="529" r="16" fill="#20ddeb" fillOpacity="0.14" />
      <circle cx="159" cy="677" r="18" fill="#20ddeb" fillOpacity="0.14" />
      <circle cx="226" cy="200" r="11" fill="url(#tartarus-core)" stroke="#72efff" strokeOpacity="0.9" strokeWidth="1.4" />
      <circle cx="182" cy="396" r="10" fill="url(#tartarus-core)" stroke="#72efff" strokeOpacity="0.88" strokeWidth="1.3" />
      <circle cx="268" cy="529" r="10" fill="url(#tartarus-core)" stroke="#72efff" strokeOpacity="0.88" strokeWidth="1.3" />
      <circle cx="159" cy="677" r="12" fill="url(#tartarus-core)" stroke="#72efff" strokeOpacity="0.9" strokeWidth="1.4" />
      <g fill="#e8ffff" fillOpacity="0.9">
        <ellipse cx="223" cy="196" rx="3.2" ry="2.3" />
        <ellipse cx="179" cy="392" rx="2.8" ry="2" />
        <ellipse cx="265" cy="525" rx="2.8" ry="2" />
        <ellipse cx="155" cy="672" rx="3.4" ry="2.4" />
      </g>
    </g>
  </svg>
);

export default Tartarus;
