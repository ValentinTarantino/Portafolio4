import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import TartarusEnergyCores from './TartarusEnergyCores';

const Tartarus = ({ isDarkHour = false }) => {
  const svgRef = useRef(null);

  useGSAP(() => {
    if (!isDarkHour) return undefined;

    const motion = gsap.matchMedia();
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const conduits = gsap.utils.toArray('.tartarus-energy-flow', svgRef.current);
      const scene = svgRef.current.closest('.dark-hour-scene');
      const reactiveFog = scene?.querySelector('.dark-hour-scene__reactive-fog');
      const distortion = scene?.querySelector('.dark-hour-scene__distortion');
      const timeline = gsap.timeline({ repeat: -1 });

      timeline.to(conduits, {
        strokeDashoffset: -24,
        duration: 6,
        stagger: 0.7,
        ease: 'none',
      }, 0);
      if (reactiveFog) {
        timeline.to(reactiveFog, {
          opacity: 0.5,
          scaleX: 1.16,
          duration: 4.4,
          repeat: 1,
          yoyo: true,
          ease: 'sine.inOut',
        }, 0);
      }
      if (distortion) {
        timeline.to(distortion, {
          opacity: 0.34,
          scale: 1.06,
          duration: 2.2,
          repeat: 3,
          yoyo: true,
          ease: 'sine.inOut',
        }, 0);
      }
      timeline.set(conduits, { strokeDashoffset: 0 }, 8.8);
      timeline.paused(document.hidden);
      const onVisibilityChange = () => timeline.paused(document.hidden);
      document.addEventListener('visibilitychange', onVisibilityChange);
      return () => document.removeEventListener('visibilitychange', onVisibilityChange);
    });

    return () => motion.revert();
  }, { scope: svgRef, dependencies: [isDarkHour], revertOnUpdate: true });

  return (
  <svg
    ref={svgRef}
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
      <linearGradient id="tartarus-annex-face" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#34764b" />
        <stop offset="0.48" stopColor="#1e4d31" />
        <stop offset="1" stopColor="#0b2819" />
      </linearGradient>
      <linearGradient id="tartarus-annex-side" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#07150f" />
        <stop offset="1" stopColor="#020907" />
      </linearGradient>
      <filter id="tartarus-green-light" x="-5%" y="-2%" width="110%" height="104%" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="1.08 0 0 0 0  0 1.65 0 0 0.02  0 0 1.12 0 0  0 0 0 1 0" />
      </filter>
    </defs>

    <g transform="translate(37.8 0) scale(0.82 1)" filter="url(#tartarus-green-light)">
    {/* The outside contour now breaks its repeated stair rhythm into uneven shoulders. */}
    <path
      d="M104 900 108 834Q89 818 93 798L75 778Q61 760 75 741L53 722Q46 704 68 689L62 669Q59 647 81 631L71 609Q65 587 89 570L78 546Q72 524 96 509L85 487Q80 466 104 450L93 428Q89 405 112 388L101 367Q98 345 122 329L107 310Q104 289 130 275L144 251 160 223 177 205 181 174 199 153 203 123 216 101 215 66 228 29 242 63 242 102 255 127 253 157 274 174 270 196 292 214 309 230 337 244 358 265 367 286 349 306 371 328 364 351 381 375 369 398 384 420 368 444 377 469 355 489 366 514 344 535 359 559 338 578 353 602 328 623 342 648 322 669 334 695 313 719 330 744 306 765 321 790 297 816 306 843 300 900Z"
      fill="url(#tartarus-shell)"
      stroke="#176b4a"
      strokeOpacity="0.52"
      strokeWidth="1.5"
    />

    {/* Five larger, connected structures reshape the skyline into a vertical labyrinth. */}
    <g className="tartarus-architectural-modules" strokeLinejoin="bevel">
      {/* Upper relay keep: a stepped annex projects beyond the right shoulder. */}
      <g className="tartarus-module tartarus-module--upper">
        <path d="M281 231C292 219 308 216 324 201C339 192 352 204 370 208C387 214 400 226 405 240C411 257 399 270 389 282C376 299 359 291 348 283C339 277 332 294 320 299C307 302 296 286 286 278C275 267 276 244 281 231Z" fill="url(#tartarus-annex-side)" stroke="#176b4a" strokeOpacity=".5" strokeWidth="2" />
        <path d="M286 234C299 227 312 224 327 209C340 201 353 211 369 216C383 220 392 231 397 242C401 254 390 265 380 275C369 286 356 279 345 273C334 267 328 284 318 288C306 289 298 277 290 270C283 262 280 244 286 234Z" fill="url(#tartarus-annex-face)" stroke="#398b5b" strokeOpacity=".58" strokeWidth="1.7" />
        <path d="M311 228 330 225 330 258 311 258Z" fill="#061b14" stroke="#176b4a" strokeOpacity=".5" />
        <path d="M355 226H371V234H380V250H371V263H357V251H364V240H355Z" fill="#071a12" stroke="#247b50" strokeOpacity=".5" />
        <path d="M279 265H313L326 276H347V285H319L303 276H279Z" fill="#0b2419" stroke="#36d99a" strokeOpacity=".4" />
        <path d="M339 213V246L327 260M359 222V249L377 259" fill="none" stroke="#36d99a" strokeOpacity=".48" strokeWidth="2" />
        <path d="M351 224V247M370 229V242" fill="none" stroke="#a2ffc5" strokeOpacity=".58" strokeWidth="3" />
      </g>

      {/* West bastion: a broad, split-level terrace with a recessed service court. */}
      <g className="tartarus-module tartarus-module--west">
        <path d="M119 345C105 340 97 326 84 321C68 315 53 323 41 328C25 333 16 342 14 357C11 372 17 384 22 395C26 411 40 418 54 423C69 435 86 431 98 419C112 414 128 407 138 395C146 384 135 372 130 361C127 352 124 347 119 345Z" fill="url(#tartarus-annex-side)" stroke="#176b4a" strokeOpacity=".52" strokeWidth="2" />
        <path d="M112 351C100 347 94 335 82 331C68 326 56 332 45 337C32 341 24 349 23 360C20 372 26 383 30 392C34 404 45 411 57 416C70 426 83 421 94 411C108 406 120 400 129 390C135 381 126 372 122 363C120 357 117 353 112 351Z" fill="url(#tartarus-annex-face)" stroke="#398b5b" strokeOpacity=".58" strokeWidth="1.7" />
        <path d="M42 360H56V354H70V369H82V383H69V397H54V385H42Z" fill="#061710" stroke="#206b47" strokeOpacity=".5" />
        <path d="M99 367H107V377H113V390H104V399H96V386H101V379H99Z" fill="#081b14" stroke="#206b47" strokeOpacity=".44" />
        <path d="M23 389 49 402 66 419 91 421 105 410 125 398 133 406 107 428 72 444 36 425 17 403Z" fill="#0b2419" stroke="#36d99a" strokeOpacity=".4" />
        <path d="M51 354V386L68 400M101 365V389L87 411" fill="none" stroke="#36d99a" strokeOpacity=".46" strokeWidth="2" />
        <path d="M58 354V382M104 373V389" fill="none" stroke="#a2ffc5" strokeOpacity=".52" strokeWidth="3" />
      </g>

      {/* East transfer hall: an offset block and suspended lower platform. */}
      <g className="tartarus-module tartarus-module--east">
        <path d="M300 406C309 398 319 399 329 386C339 376 351 382 365 389C378 387 390 398 393 411C405 418 411 432 405 445C401 458 389 465 376 469C368 483 352 488 339 480C324 479 315 468 313 456C300 453 289 442 290 429C291 419 295 412 300 406Z" fill="url(#tartarus-annex-side)" stroke="#176b4a" strokeOpacity=".5" strokeWidth="2" />
        <path d="M305 413C314 407 323 408 332 395C341 387 351 391 362 397C374 396 383 405 386 417C396 423 400 434 396 444C392 455 382 460 370 464C362 475 350 479 340 472C327 471 321 461 319 449C308 446 299 438 300 429C300 421 302 417 305 413Z" fill="url(#tartarus-annex-face)" stroke="#398b5b" strokeOpacity=".54" strokeWidth="1.6" />
        <path d="M307 414 327 402 344 402 344 417 357 417 357 437 341 437 341 447 322 447 322 436 307 436Z" fill="#061710" stroke="#206b47" strokeOpacity=".56" />
        <path d="M365 419H376V427H384V440H376V455H364V444H370V433H365Z" fill="#081b14" stroke="#206b47" strokeOpacity=".44" />
        <path d="M311 450 337 464 367 471 390 451 399 458 375 483 338 478 309 461Z" fill="#0b2419" stroke="#36d99a" strokeOpacity=".4" />
        <path d="M330 405V433L347 449M375 412V438L360 457" fill="none" stroke="#36d99a" strokeOpacity=".45" strokeWidth="2" />
      </g>

      {/* Lower west root: a massive buttressed platform partly hidden by the city haze. */}
      <g className="tartarus-module tartarus-module--root">
        <path d="M101 551C87 547 80 534 66 534C53 530 44 540 33 545C20 550 13 562 14 577C9 591 18 604 28 614C33 629 48 635 60 645C74 655 91 647 103 637C119 635 133 628 142 616C151 605 144 593 137 583C136 567 124 557 110 557C107 553 104 551 101 551Z" fill="url(#tartarus-annex-side)" stroke="#176b4a" strokeOpacity=".46" strokeWidth="2" />
        <path d="M96 557C84 554 78 543 66 543C55 540 47 548 37 553C27 558 21 568 22 579C19 590 26 601 35 610C39 622 51 628 62 636C74 644 88 638 99 629C113 626 126 620 134 610C141 601 135 592 129 583C128 570 118 563 107 563C103 559 99 557 96 557Z" fill="url(#tartarus-annex-face)" stroke="#398b5b" strokeOpacity=".52" strokeWidth="1.6" />
        <path d="M35 579H49V573H66V587H77V600H65V614H49V603H35Z" fill="#061710" stroke="#206b47" strokeOpacity=".46" />
        <path d="M96 577H105V585H112V598H103V607H94V594H99V587H96Z" fill="#081b14" stroke="#206b47" strokeOpacity=".42" />
        <path d="M31 615 55 632 79 641 103 623 132 613 143 624 108 644 78 662 43 646 23 628Z" fill="#0b2419" stroke="#36d99a" strokeOpacity=".38" />
        <path d="M47 571V603L66 622M106 579V601L91 625" fill="none" stroke="#36d99a" strokeOpacity=".42" strokeWidth="2" />
      </g>

      {/* Hanging east annex: a narrow upper tower carried by deep diagonal braces. */}
      <g className="tartarus-module tartarus-module--hanging">
        <path d="M299 621C309 617 315 604 329 602C340 594 350 601 361 605C375 602 388 612 389 627C401 635 407 649 400 662C399 678 386 687 376 692C369 707 356 716 341 712C327 719 315 708 311 696C297 692 288 681 291 667C281 655 282 640 291 631C293 626 296 623 299 621Z" fill="url(#tartarus-annex-side)" stroke="#176b4a" strokeOpacity=".48" strokeWidth="2" />
        <path d="M304 627C313 624 319 613 331 611C341 604 350 610 360 614C372 612 382 620 383 632C393 639 397 650 391 661C390 674 380 681 370 686C364 699 353 706 341 701C329 707 319 698 316 687C304 683 297 674 299 663C290 653 291 642 299 634C300 631 302 629 304 627Z" fill="url(#tartarus-annex-face)" stroke="#398b5b" strokeOpacity=".5" strokeWidth="1.6" />
        <path d="M304 634 323 620 342 620 342 637 355 637 355 657 337 657 337 669 319 669 319 655 304 655Z" fill="#061710" stroke="#206b47" strokeOpacity=".5" />
        <path d="M361 632H372V641H380V655H372V672H360V660H366V648H361Z" fill="#081b14" stroke="#206b47" strokeOpacity=".42" />
        <path d="M297 667 322 686 350 702 377 692 395 673 403 682 382 709 351 724 318 704 290 679Z" fill="#0b2419" stroke="#36d99a" strokeOpacity=".38" />
        <path d="M322 625V652L340 673M372 637V662L356 684" fill="none" stroke="#36d99a" strokeOpacity=".42" strokeWidth="2" />
      </g>

      {/* Long, selective trusses make these outboard masses structurally belong to the spine. */}
      <g fill="none" stroke="#247b50" strokeOpacity=".62" strokeWidth="3">
        <path d="M280 251 307 261M279 268 307 276M121 372 153 383M123 401 157 414M289 429 270 438M291 447 270 456M117 588 151 596M117 617 151 626M286 650 265 659M290 674 265 686" />
      </g>
      <g fill="#123b29" stroke="#36d99a" strokeOpacity=".42" strokeWidth="1.3">
        <path d="M278 258H309V265H327V275H311L300 267H278Z" />
        <path d="M117 384H146V391H164V402H144L133 394H117Z" />
        <path d="M281 436H264V443H246V454H266L276 446H289Z" />
        <path d="M113 599H142V607H160V618H141L129 610H113Z" />
        <path d="M284 655H266V662H248V673H268L279 665H292Z" />
      </g>
      <g className="tartarus-energy-flow" fill="none" stroke="#48efa9" strokeOpacity=".62" strokeWidth="2" strokeDasharray="4 8">
        <path d="M238 200H257V217H278V249H302" />
        <path d="M172 396H155V383H137V374H119" />
        <path d="M280 529H297V542H313" />
        <path d="M147 677H130V657H116V640" />
        <path d="M286 662H266V646L249 633" />
      </g>
    </g>

    {/* Rear wings sit behind the continuous spine and give the tower its broad shoulders. */}
    <g stroke="#176b4a" strokeOpacity="0.34" strokeWidth="1.6">
      <path d="M118 337H151V315H173V344H190V373H177V415H156V435H121V411H103V370H118Z" fill="#0b2a20" />
      <path d="M260 196H294V215H330V257H347V282H321V312H283V292H264V256H250V225H260Z" fill="#0b2a20" />
      <path d="M280 387H307V405H339V439H357V470H331V499H293V477H274V443H286Z" fill="#0a261d" />
      <path d="M101 521H134V540H159V569H177V609H154V645H119V661H91V634H76V587H94V552H101Z" fill="#0b2a20" />
      <path d="M296 563H328V544H350V577H365V620H346V659H326V699H293V676H278V639H296Z" fill="#0a261d" />
    </g>

    {/* Curved buttresses interrupt the box-like rhythm and make the outer mass feel grown. */}
    <g stroke="#176b4a" strokeWidth="2" strokeLinejoin="round">
      <path d="M174 264C155 250 140 260 143 279C146 296 157 302 149 316C143 328 127 331 113 340C98 350 98 364 111 375L124 366C117 358 122 352 135 346C158 336 174 322 169 305C165 291 158 282 166 274C170 271 175 273 181 279Z" fill="#102b1d" fillOpacity=".92" strokeOpacity=".72" />
      <path d="M164 277C157 286 169 294 164 307C160 319 148 328 133 335M119 358C131 351 143 350 151 340" fill="none" stroke="#36d99a" strokeOpacity=".46" strokeWidth="1.5" />

      <path d="M267 447C286 435 304 443 306 461C308 478 322 483 341 486C361 489 369 503 359 520L345 516C352 505 344 499 330 497C306 494 289 484 290 465C291 456 282 454 271 462Z" fill="#102b1d" fillOpacity=".94" strokeOpacity=".72" />
      <path d="M278 455C290 450 298 456 298 468C299 483 313 490 329 492M351 505C344 513 339 509 331 508" fill="none" stroke="#36d99a" strokeOpacity=".44" strokeWidth="1.5" />

      <path d="M164 575C145 563 129 575 133 594C137 610 148 616 140 631C133 644 116 647 101 656C86 665 87 679 100 690L114 681C107 674 112 667 125 661C149 651 165 637 160 619C156 605 149 596 157 587C161 582 168 585 174 591Z" fill="#102b1d" fillOpacity=".9" strokeOpacity=".68" />
      <path d="M154 588C147 598 159 607 154 621C150 634 138 642 122 649M106 674C119 666 132 665 141 655" fill="none" stroke="#36d99a" strokeOpacity=".4" strokeWidth="1.5" />
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

    {/* The spine keeps its height, but its shoulders and setbacks no longer repeat evenly. */}
    <path d="M184 205Q209 198 262 205L259 228Q274 239 281 251L272 273 289 297 276 316 293 340 272 357 285 382 267 402 293 429 270 448 288 473 267 494 283 516 260 537 282 560 263 581 276 606 254 628 280 653 259 674 275 696 254 719 279 744 256 764 273 789 251 813 268 839 255 900H158L162 850Q149 839 156 820L140 797 158 773 145 750 164 729 142 706 160 684 143 660 163 639 144 615 165 593 149 570 168 548 146 524 170 502 155 479 177 457 151 435 176 413 158 389 179 367 163 344 184 322 168 298 190 276 174 251 192 231 179 215Z" fill="#0c2518" fillOpacity="0.9" />
    <path d="M213 111H247L245 151Q257 165 248 183L237 202 254 219 239 242 251 267 234 291 248 315 232 339 251 363 232 388 248 412 229 437 250 461 231 486 247 510 228 536 246 560 227 586 247 611 228 637 250 662 230 687 247 711 226 737 245 762 223 788 242 814 219 842 232 900 222 900 220 845 211 818 226 792 209 767 229 740 211 716 232 689 212 665 234 640 211 615 232 591 209 564 231 539 209 513 232 489 211 463 234 439 210 415 233 390 211 366 234 341 210 316 234 292 211 267 232 243 211 220 221 199 207 177 218 153Z" fill="url(#tartarus-side)" />

    {/* Recesses, vertical bays, and cross-members articulate the wing facades. */}
    <g fill="#020b09" fillOpacity="0.9">
      <path d="M124 349Q128 345 132 350L130 360Q135 366 131 374L125 376Q120 369 123 361Z M140 343Q145 341 146 347L143 356Q148 362 144 368L139 369Q136 362 138 355Z M162 355Q167 352 169 358L166 366Q170 371 166 376L161 374Z" />
      <path d="M303 230Q308 226 311 232L309 241Q314 247 310 254L304 255Q301 248 303 241Z M318 238Q323 235 325 241L322 249Q327 254 323 260L318 259Z M333 271Q338 268 340 274L337 282Q340 286 336 290L332 286Z" />
      <path d="M315 420Q320 416 323 422L321 432Q326 438 322 445L316 445Q312 438 315 431Z M331 444Q336 441 338 447L335 455Q339 461 335 466L330 463Z M292 455Q297 451 300 457L297 466Q301 471 297 476L291 474Z" />
      <path d="M105 566Q110 562 113 568L111 577Q116 583 112 589L106 590Q102 583 105 577Z M122 575Q127 572 130 579L127 588Q132 594 128 602L122 601Q119 593 122 586Z M143 589Q148 586 151 592L148 600Q151 605 147 610L142 607Z" />
      <path d="M308 588Q313 584 316 590L314 600Q319 606 315 612L309 612Q305 605 308 599Z M326 601Q331 597 334 604L331 615Q336 621 332 628L326 626Q323 618 326 612Z M339 635Q344 632 347 638L344 647Q347 652 343 657L338 654Z" />
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

    {/* Offset inner buttresses bend around the shaft instead of forming another box grid. */}
    <g fill="#0a2118" stroke="#176b4a" strokeOpacity="0.46" strokeWidth="1.4">
      <path d="M262 212C273 208 282 218 279 232C289 245 292 258 285 270L279 290Q270 301 257 291L262 272Q253 260 260 247C253 234 254 220 262 212Z" strokeOpacity="0.38" fill="#0b241a" />
      <path d="M155 319C168 315 178 327 174 341Q187 355 180 371L170 388Q158 398 147 386L151 366Q144 352 153 342C148 332 149 324 155 319Z" />
      <path d="M287 386C299 382 308 394 304 408Q320 419 313 435L303 451Q291 460 280 447L285 429Q277 416 286 406C280 397 281 390 287 386Z" />
      <path d="M119 568C132 562 143 573 140 587Q155 598 148 615L137 632Q124 640 114 627L119 607Q111 594 119 584C113 577 114 571 119 568Z" />
      <path d="M285 603C298 598 307 610 303 624Q319 636 311 652L300 669Q287 677 277 664L282 644Q274 631 282 620C277 612 279 606 285 603Z" />
      <path d="M166 747C177 742 187 751 185 765Q202 775 196 791L185 807Q173 815 162 803L166 784Q158 772 165 762C160 755 161 750 166 747Z" />
    </g>
    <g fill="none" stroke="#36d99a" strokeOpacity="0.38" strokeWidth="1.8">
      <path d="M246 231Q258 228 266 240M169 356Q177 360 180 371M267 420Q279 415 289 426M137 594Q148 596 152 608M265 631Q279 627 289 639M177 777Q189 775 197 786" />
      <path d="M270 231Q263 252 276 270M160 337Q169 349 158 366M294 408Q286 426 300 441M129 584Q139 598 126 614M294 622Q286 638 298 654M174 772Q166 784 177 799" />
    </g>

    {/* Uneven inner bridges follow the ribs with oblique, curved connections. */}
    <g fill="#0b1b12" stroke="#36d99a" strokeOpacity="0.38" strokeWidth="1.4">
      <path d="M107 411Q125 405 142 413Q154 418 162 428L151 434Q137 424 125 425Q115 425 107 419Z" />
      <path d="M298 416Q312 412 325 422Q319 432 317 444Q315 455 306 463L299 454Q307 438 303 428Z" />
      <path d="M106 505Q119 497 134 506Q145 514 149 528L137 534Q130 523 121 523Q113 522 106 516Z" />
      <path d="M300 548Q318 540 335 551Q347 558 351 571L338 578Q328 566 317 568Q307 569 300 562Z" />
      <path d="M112 636Q127 629 140 640Q149 650 144 665L131 668Q135 654 126 651Q118 649 112 646Z" />
      <path d="M305 638Q323 630 341 642Q353 651 360 666L346 671Q338 657 326 659Q315 660 305 653Z" />
      <path d="M105 722Q119 715 133 724Q143 733 139 748L126 752Q130 739 120 737Q112 736 105 731Z" />
      <path d="M306 725Q323 715 340 726Q351 735 355 750L341 755Q335 741 324 744Q314 746 306 739Z" />
      <path d="M165 300Q148 305 136 293Q127 284 130 273L142 271Q141 282 151 284Q159 284 166 289Z" />
      <path d="M276 249Q290 242 303 251Q312 258 311 270L298 273Q298 262 289 261Q282 261 276 266Z" strokeOpacity="0.3" />
    </g>

    {/* Broken transfer shelves vary in length, angle and curvature through the interior. */}
    <g fill="#123a29" fillOpacity="0.82" stroke="#36d99a" strokeOpacity="0.42" strokeWidth="1.5">
      <path d="M170 244Q191 236 211 244L240 240Q264 238 280 249L264 258Q245 254 229 261L201 257Q184 260 170 252Z" />
      <path d="M140 367Q165 358 187 365L217 360Q248 361 271 369L305 369L290 379Q264 377 246 385L211 379Q181 384 159 378Z" />
      <path d="M119 453Q137 445 154 452L179 449Q194 451 202 462L185 468Q169 463 157 472L137 464L119 463Z" />
      <path d="M277 440Q294 432 309 440L333 439Q347 443 351 455L335 462Q321 454 307 464L289 456L278 453Z" />
      <path d="M103 544Q119 536 136 543L158 541Q169 545 165 556L149 562Q137 556 126 565L108 555Z" />
      <path d="M251 619Q275 611 295 619L326 615Q350 616 367 628L348 637Q326 630 307 640L277 633L252 632Z" />
      <path d="M76 717Q100 707 123 716L151 712Q173 716 190 727L171 735Q151 727 135 738L105 730L77 729Z" />
      <path d="M84 802Q105 793 123 800L150 797Q170 800 181 812L163 820Q145 813 130 823L106 815L84 814Z" />
    </g>

    {/* Curved seams and diagonal ribs replace the inner ladder-like grid. */}
    <g fill="none" stroke="#36d99a" strokeOpacity="0.28" strokeWidth="1.4">
      <path d="M184 214Q201 208 215 218T246 216M179 373Q187 365 199 375T214 371M264 373Q276 366 289 378M153 460Q165 451 180 462M284 456Q297 449 313 460M139 548Q147 541 162 551M270 630Q292 620 312 632T339 628M105 725Q127 715 149 728T172 724M106 812Q124 803 144 815T161 810" />
      <path d="M202 157Q192 177 204 192L196 211M184 247Q199 258 188 276T197 301M174 329Q185 342 176 355T188 374M154 416Q168 429 157 443L174 458M267 416Q255 430 272 443T264 461M139 505Q154 517 143 531T158 549M278 505Q265 518 281 532M124 594Q140 607 129 621T143 640M282 594Q269 605 286 619M112 682Q126 694 116 707T130 727M286 682Q274 694 291 711L282 730" />
      <path d="M205 119L199 143Q207 153 197 167M239 166Q229 181 242 194L233 207M191 286Q204 300 192 315T204 334M246 286Q235 301 249 316L239 337M181 373Q194 388 182 401T195 420M251 373Q239 388 254 404L244 425M177 460Q190 475 178 489T190 509M246 460Q234 475 249 492L238 512M169 548Q183 560 171 576T185 596M245 548Q233 563 249 580L237 600M161 638Q175 651 164 667T178 686M246 638Q233 653 249 669L238 689M154 725Q168 739 157 753T171 774M244 725Q231 739 247 757L235 778" />
    </g>

    {/* Sparse slanted braces connect the wings without boxing the center in. */}
    <g fill="none" stroke="#36d99a" strokeOpacity="0.36" strokeWidth="1.8">
      <path d="M154 420Q166 415 178 430M267 426Q281 417 300 432M148 510Q160 505 171 521M278 516Q295 509 318 526M143 642Q151 636 162 653M272 648Q289 640 305 658M137 729Q146 722 157 739M270 735Q288 728 306 746M117 419Q129 412 139 423L127 438M145 419Q153 429 137 438M311 478Q321 480 327 491L321 501M332 476Q340 485 342 496" />
      <path d="M160 424Q172 438 166 452M291 429Q282 442 297 457M153 514Q165 527 158 544M301 560Q289 574 304 589M155 646Q168 657 160 677M293 651Q281 663 298 679M149 733Q161 745 153 761M296 742Q284 754 302 769" />
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

    {/* These attached building masses sit inside the structural layers, not on top of their surface details. */}
    <g className="tartarus-integrated-buildings" strokeLinejoin="round">
      <g stroke="#176b4a" strokeOpacity=".72" strokeWidth="1.2">
        <path d="M166 375Q175 366 185 371L194 363 204 369 214 365 226 373 240 369 245 377 228 383 213 378 200 385 183 380Z" fill="#102d1e" />
        <path d="M181 369 182 351 187 347 186 335Q190 329 196 334L197 316Q202 309 207 319L207 337 213 342 212 359 221 367 220 374 205 377 194 371Z" fill="#071910" />
        <path d="M198 371V337L204 331 204 345 210 350V373Z" fill="#16432d" />
        <path d="M167 373 169 357 174 354 176 344Q182 340 186 348L185 361 191 366 190 374Z" fill="#0d2b1c" />
        <path d="M213 372 214 353 220 348 220 339Q226 334 231 342L230 355 236 362 235 375Z" fill="#0b2418" />
      </g>
      <g fill="url(#tartarus-light)">
        <path d="M190 343h2v6h-2zm0 12h2v7h-2zm10-28h2v8h-2zm7 22h2v7h-2zm15 3h2v7h-2zm-44 2h2v6h-2z" />
      </g>

      <g stroke="#176b4a" strokeOpacity=".72" strokeWidth="1.2">
        <path d="M190 502Q202 494 215 500L227 494 240 499 251 495 263 503 273 500 278 508 262 514 246 509 231 516 214 510 197 516Z" fill="#102d1e" />
        <path d="M198 508 200 487 205 482 204 470Q210 463 216 471L217 451Q223 443 229 455L229 474 236 480 235 493 243 501 241 509 226 514 213 507Z" fill="#071910" />
        <path d="M218 508V474L225 466 225 481 232 487V510Z" fill="#16432d" />
        <path d="M190 508 192 491 198 487 199 478Q205 474 209 482L208 495 214 501 213 511Z" fill="#0d2b1c" />
        <path d="M241 507 243 488 249 484 250 475Q256 470 261 478L260 491 266 498 265 511Z" fill="#0b2418" />
      </g>
      <g fill="url(#tartarus-light)">
        <path d="M208 484h2v7h-2zm0 13h2v8h-2zm12-39h2v9h-2zm8 27h2v7h-2zm17 4h2v7h-2zm8-8h2v7h-2zm-56 16h2v6h-2z" />
      </g>

      <g stroke="#176b4a" strokeOpacity=".72" strokeWidth="1.2">
        <path d="M166 628Q179 619 192 625L204 619 218 625 231 621 243 630 254 627 258 635 241 641 224 636 210 644 193 638 175 643Z" fill="#102d1e" />
        <path d="M177 636 179 616 184 610 183 599Q189 592 195 600L196 582Q202 574 208 586L208 604 214 611 213 624 222 632 220 640 205 644 192 637Z" fill="#071910" />
        <path d="M197 638V604L204 597 204 612 211 618V640Z" fill="#16432d" />
        <path d="M166 638 168 622 174 618 175 609Q181 605 185 613L184 626 190 632 189 641Z" fill="#0d2b1c" />
        <path d="M224 637 226 619 232 615 233 606Q239 601 244 609L243 622 249 629 248 640Z" fill="#0b2418" />
      </g>
      <g fill="url(#tartarus-light)">
        <path d="M187 618h2v7h-2zm0 13h2v8h-2zm12-35h2v8h-2zm8 25h2v7h-2zm18 3h2v8h-2zm8-10h2v7h-2zm-53 15h2v6h-2z" />
      </g>

      <g stroke="#176b4a" strokeOpacity=".7" strokeWidth="1.2">
        <path d="M171 799Q184 791 197 797L209 791 223 797 236 793 248 802 258 799 262 807 245 813 228 808 214 816 197 810 180 815Z" fill="#102d1e" />
        <path d="M181 807 183 787 188 781 187 770Q193 763 199 771L200 753Q206 745 212 757L212 775 219 781 218 795 227 803 225 811 210 815 197 808Z" fill="#071910" />
        <path d="M201 809V775L208 768 208 783 215 789V811Z" fill="#16432d" />
        <path d="M171 809 173 793 179 789 180 780Q186 776 190 784L189 797 195 803 194 812Z" fill="#0d2b1c" />
        <path d="M229 808 231 790 237 786 238 777Q244 772 249 780L248 793 254 800 253 811Z" fill="#0b2418" />
      </g>
      <g fill="url(#tartarus-light)">
        <path d="M191 785h2v7h-2zm0 13h2v8h-2zm12-34h2v8h-2zm8 24h2v7h-2zm18 4h2v8h-2zm8-10h2v7h-2zm-53 15h2v6h-2z" />
      </g>
    </g>

    {/* Four contained energy cores sit in framed sockets at staggered heights. */}
    <g fill="#071a16" stroke="#159eac" strokeOpacity="0.72" strokeWidth="1.7">
      <path d="M211 179H238V185H245V195H240V212H233V219H213V212H205V190H211Z" />
      <path d="M162 376H176V371H193V379H201V391H196V412H186V418H168V411H159V394H165V386H162Z" />
      <path d="M252 511H273V516H286V526H296V533H286V543H276V550H253V543H246V519H252Z" />
      <path d="M143 657H153V652H169V660H180V672H187V681H177V692H165V700H145V693H137V669H143Z" />
    </g>
    </g>
    <foreignObject x="0" y="0" width="420" height="900" pointerEvents="none">
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        className="tartarus-energy-webgl-host"
        style={{ width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}
      >
        <TartarusEnergyCores isDarkHour={isDarkHour} />
      </div>
    </foreignObject>
  </svg>
  );
};

export default Tartarus;
