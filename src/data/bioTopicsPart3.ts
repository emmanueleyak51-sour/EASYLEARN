import type { Topic } from '../types';

export const BIO_TOPICS_PART3: Topic[] = [
  // 21. Reproductive Systems in Vertebrates, Gametogenesis & Placenta
  {
    id: 'b-mammalian-repro',
    name: 'Mammalian Reproduction, Hormones & Placenta',
    sec: 'SS 3 · First Term · Continuity of Life',
    boss: 'Gametogenesis, Menstrual Cycle & Placenta Test',
    goals: [
      'Compare oviparity, ovoviviparity, and viviparity across vertebrates, and map male/female mammalian reproductive organs (testis, epididymis, oviduct, uterus)',
      'Sequence FSH, Oestrogen, LH, and Progesterone across the 28-day menstrual cycle, fertilization in the oviduct, and foetal–maternal placental exchange',
    ],
    trap: 'FERTILIZATION in mammals occurs in the upper third of the OVIDUCT (Fallopian tube), NEVER in the uterus — the uterus is where IMPLANTATION of the blastocyst occurs!',
    parts: [
      {
        title: 'Male & Female Reproductive Organs + 28-Day Hormonal Cycle',
        idea: 'Testes hang outside the abdominal cavity in the scrotal sac at ~35 °C (2 °C cooler than core 37 °C) so spermatogenesis succeeds; in females, pituitary FSH & LH coordinate ovarian oestrogen & progesterone across a ~28-day cycle.',
        rules: [
          'Male pathway: Seminiferous tubules (form sperm + Sertoli nourishment; interstitial Leydig cells make TESTOSTERONE) → Epididymis (stores & matures sperm!) → Vas deferens (sperm duct) → Seminal vesicles / Prostate / Cowper’s glands (alkaline seminal fluid + fructose fuel) → Urethra.',
          'Sperm anatomy: Acrosome cap (lytic enzymes digest egg zona pellucida), haploid Nucleus (n = 23), Middle piece packed with MITOCHONDRIA (ATP for flagellum swimming!).',
          'Menstrual cycle (~28 days): (1) Pituitary FSH stimulates Graafian follicle growth; (2) Follicle secretes OESTROGEN (repairs uterine endometrium + inhibits FSH); (3) Day ~14 Pituitary LH SURGE triggers OVULATION + turns ruptured follicle into yellow CORPUS LUTEUM; (4) Corpus luteum secretes PROGESTERONE (“pregnancy hormone” — thickens vascular endometrium & prevents uterine contractions).',
        ],
        ex: {
          q: 'Why does surgical removal of the ovaries (or failure of the corpus luteum) during the first 6 weeks of human pregnancy cause immediate miscarriage, whereas removal in month 6 does not?',
          steps: [
            ['Weeks 1–10: Corpus luteum in the ovary is the SOLE source of progesterone maintaining the uterine lining', 'Without progesterone, the endometrium breaks down and sheds (miscarriage).'],
            ['By month 4+, the PLACENTA itself secretes sufficient progesterone and oestrogen', 'Takes over pregnancy maintenance from the degenerating corpus luteum!'],
          ],
        },
        tryit: {
          q: 'A sharp mid-cycle surge of which pituitary hormone around Day 14 triggers ovulation of the secondary oocyte from the mature Graafian follicle?',
          o: [
            'Luteinizing hormone (LH)',
            'Progesterone',
            'Oxytocin',
            'Prolactin',
          ],
          a: 0,
          h: 'FSH grows the follicle first; which pituitary surge ruptures it at Day 14 and forms the corpus luteum?',
          e: 'The mid-cycle LH surge ruptures the mature Graafian follicle (ovulation) and luteinizes its wall into the progesterone-secreting corpus luteum.',
        },
      },
      {
        title: 'Fertilization, Foetal Membranes & Placental Exchange',
        idea: 'Maternal and foetal bloodstreams NEVER mix directly in the placenta (preventing maternal blood pressure from bursting foetal capillaries and avoiding blood-group agglutination); exchange occurs by diffusion/active transport across chorionic villi.',
        rules: [
          'Foetal → Maternal across placenta (via umbilical arteries): CO₂, urea, metabolic wastes. Maternal → Foetal (via umbilical vein): O₂, glucose, amino acids, vitamins, passive IgG antibodies (plus harmful alcohol, nicotine, HIV, rubella, thalidomide!).',
          'Amnion + Amniotic fluid: cushions foetus against mechanical shock, prevents desiccation, maintains constant temperature, allows free symmetrical limb growth.',
          'Birth & Lactation: OXYTOCIN (posterior pituitary) stimulates rhythmic uterine myometrial contractions (labour) & milk let-down; PROLACTIN (anterior pituitary) stimulates mammary milk synthesis.',
        ],
        ex: {
          q: 'State TWO vital reasons why maternal blood and foetal blood are kept separated by a thin chorionic barrier inside the mammalian placenta rather than mixing directly.',
          steps: [
            ['1. Maternal arterial blood pressure is far too high for delicate foetal capillaries', 'Direct connection would rupture foetal vessels.'],
            ['2. Maternal and foetal ABO or Rhesus blood groups may be incompatible (e.g. Group O mother + Group A foetus)', 'Mixing would trigger fatal agglutination of red blood cells!'],
          ],
        },
        tryit: {
          q: 'In where exactly does fertilization of the mammalian ovum take place, and which sperm organelle provides the ATP required to swim there?',
          o: [
            'Upper part of the oviduct (Fallopian tube); mitochondria packed in the sperm middle piece',
            'Cavity of the uterus (womb); acrosome cap at the anterior tip of the sperm head',
            'Graafian follicle of the ovary; centrioles inside the sperm tail tip',
            'Cervical canal; Golgi vesicles inside the haploid sperm nucleus',
          ],
          a: 0,
          h: 'Cilia and peristalsis sweep the egg down the Fallopian tube where sperm meet it; middle-piece mitochondria power flagellar whipping!',
          e: 'Fertilization occurs in the ampulla (upper third) of the Fallopian tube, and spiral mitochondria in the sperm middle piece generate ATP for flagellar propulsion.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Why are mammalian testes suspended outside the main abdominal cavity inside the scrotal sac?', o: ['Sperm maturation requires a temperature ~2 °C lower than core body temperature (37 °C)', 'Testes require direct atmospheric oxygen diffusing through scrotal skin', 'Abdominal peristalsis would crush Leydig cells during digestion', 'Testosterone is denatured immediately above 30 °C'], a: 0, e: 'Failure of testes to descend (cryptorchidism) exposes seminiferous tubules to 37 °C core heat, arresting spermatogenesis and causing male sterility.' },
      { l: 2, q: 'In an amniotic bird or reptile egg (cleidoic egg), which extra-embryonic membrane stores insoluble uric acid waste AND acts as the primary gas-exchange organ beneath the porous shell?', o: ['Allantois (fused with chorion)', 'Amnion', 'Vitelline yolk membrane', 'Chalaza'], a: 0, e: 'The allantois collects embryonic nitrogenous waste (uric acid) and vascularizes against the chorion/shell for O₂/CO₂ exchange; yolk sac supplies food; amnion cushions.' },
      { l: 3, q: 'Identical (monozygotic) twins differ genetically from fraternal (dizygotic) twins in that identical twins:', o: ['Arise from a single fertilized ovum that splits into two embryos, sharing 100% identical genotypes and ALWAYS the same sex', 'Arise from two separate ova fertilized by two separate spermatozoa in the same cycle', 'Always possess one male and one female sibling attached to two separate placentas', 'Contain triploid (3n) somatic nuclei due to polyspermy'], a: 0, e: 'Monozygotic twins come from mitotic cleavage of ONE zygote (1 egg + 1 sperm → identical DNA & sex); dizygotic twins come from 2 eggs + 2 sperm (genetically like ordinary siblings).' },
      { l: 3, q: 'In the male mammal, matured spermatozoa are stored and acquire motility inside the coiled:', o: ['Epididymis', 'Ureter', 'Cowper’s gland', 'Glomerulus'], a: 0, e: 'Spermatozoa formed in seminiferous tubules pass into the tightly coiled epididymis (~6 m long) for storage and physiological maturation.' },
      { l: 4, q: 'Oral contraceptive pills taken daily by women prevent pregnancy primarily by:', o: ['Maintaining elevated synthetic oestrogen and progesterone levels that inhibit pituitary FSH and LH, thereby preventing follicle maturation and ovulation', 'Dissolving the acrosome cap of spermatozoa inside the male epididymis', 'Stimulating massive daily LH surges so 20 ova are shed simultaneously', 'Blocking implantation exclusively via copper ions in the Fallopian tube'], a: 0, e: 'Combined oestrogen–progestogen pills exert negative feedback on the anterior pituitary, suppressing FSH and the mid-cycle LH surge so ovulation does not occur.' },
      { l: 5, q: 'Compare parental care and egg numbers in tilapia/toad (external fertilization) versus mammals (internal fertilization & viviparity):', o: ['External fertilizers lay thousands of unprotected eggs to offset massive predation/wastage, whereas viviparous mammals produce very few ova with intensive internal protection and milk care', 'Mammals release millions of ova per cycle because internal fertilization is highly wasteful', 'Toads nourish embryos via a uterine placenta for nine months', 'Birds lack internal fertilization and lay shell-less aquatic eggs'], a: 0, e: 'Evolutionary trade-off: high fecundity + low parental investment in external aquatic spawners vs low egg number + internal gestation/lactation ensuring high offspring survival in mammals.' },
    ],
  },

  // 22. Mendelian Genetics — Monohybrid, Dihybrid, Test Cross & Incomplete Dominance
  {
    id: 'b-mendel',
    name: 'Mendelian Genetics — Crosses & Ratios',
    sec: 'SS 3 · First Term · Continuity of Life',
    boss: 'Mendel’s Laws & Genetic Ratios Test',
    goals: [
      'Apply Mendel’s First Law (Segregation → 3:1 phenotypic, 1:2:1 genotypic) and Second Law (Independent Assortment → 9:3:3:1 dihybrid F₂)',
      'Solve test-cross problems (crossing with homozygous recessive → 1:1 or 1:1:1:1) and incomplete/co-dominance crosses (1:2:1 phenotypic AND genotypic!)',
    ],
    trap: 'To determine whether a dominant-looking individual (T_) is TT or Tt, ALWAYS cross it with the HOMOZYGOUS RECESSIVE (tt) — NEVER with another dominant individual!',
    parts: [
      {
        title: 'Mendel’s First Law (Monohybrid Cross) & Test Cross',
        idea: 'Mendel’s First Law (Law of Segregation) states that paired alleles separate cleanly during gamete formation (meiosis anaphase I) so each gamete carries ONLY ONE allele of every gene.',
        rules: [
          'Monohybrid F₁ × F₁ (Tt × Tt): Genotypic ratio = 1 TT : 2 Tt : 1 tt (25% : 50% : 25%). Phenotypic ratio (complete dominance) = 3 Tall : 1 Dwarf (75% : 25%).',
          'TEST CROSS: unknown dominant phenotype (TT or Tt?) × homozygous recessive (tt)! If ALL offspring are tall (100% Tt) → parent was TT; if offspring split 1 Tall : 1 Dwarf (50% Tt : 50% tt) → parent was heterozygous Tt!',
          'Incomplete dominance (Mirabilis jalapa four-o’clock flower / Antirrhinum snapdragon: Red RR × White WW → ALL Pink RW in F₁!): F₂ ratio is 1 Red (RR) : 2 Pink (RW) : 1 White (WW) — phenotypic ratio EQUALS genotypic ratio (1:2:1)!',
        ],
        ex: {
          q: 'In garden peas, axial flower (A) is dominant over terminal flower (a). A heterozygous axial plant is crossed with a terminal plant, producing 240 seeds. How many offspring are expected to bear terminal flowers?',
          steps: [
            ['Write parental genotypes: Aa (heterozygous axial) × aa (homozygous recessive terminal)', 'Gametes: (½ A, ½ a) × (all a).'],
            ['Offspring genotypes = ½ Aa (axial) : ½ aa (terminal) → 1 : 1 test-cross ratio', 'Expected terminal plants = ½ × 240 = 120 plants!'],
          ],
        },
        tryit: {
          q: 'In Mirabilis jalapa (four-o’clock plant), red flower (R) shows incomplete dominance with white flower (W), producing pink heterozygotes (RW). If two pink-flowered plants are crossed, what percentage of F₂ plants will bear pink flowers?',
          o: ['50%', '75%', '25%', '100%'],
          a: 0,
          h: 'Punnett square for RW × RW gives 1 RR (red) : 2 RW (pink) : 1 WW (white)!',
          e: 'RW × RW yields ¼ RR (25% red), ½ RW (50% pink), and ¼ WW (25% white).',
        },
      },
      {
        title: 'Mendel’s Second Law (Dihybrid 9 : 3 : 3 : 1 Independent Assortment)',
        idea: 'Mendel’s Second Law (Independent Assortment) applies to unlinked genes on DIFFERENT homologous chromosome pairs: alleles of one gene assort into gametes independently of alleles of another gene.',
        rules: [
          'Double heterozygote RrYy produces 4 equally probable gametes (¼ each): RY, Ry, rY, ry (general formula: 2ⁿ gamete types where n = number of heterozygous gene pairs!).',
          'Selfing RrYy × RrYy (16-box Punnett): 9 R_Y_ (Round Yellow) : 3 R_yy (Round Green) : 3 rrY_ (Wrinkled Yellow) : 1 rryy (Wrinkled Green).',
          'Dihybrid Test Cross (RrYy × rryy): produces 1 RrYy : 1 Rryy : 1 rrYy : 1 rryy (1 : 1 : 1 : 1 ratio!). Exception to Mendel’s 2nd Law: AUTOSOMAL GENE LINKAGE (genes on the same chromosome travel together unless separated by crossing-over).',
        ],
        ex: {
          q: 'How many distinct types of gametes can be produced by an organism of genotype AaBbCcDD (assuming all loci lie on separate chromosomes)?',
          steps: [
            ['Count heterozygous gene pairs n: Aa (1), Bb (2), Cc (3); DD is homozygous (0)', 'So n = 3 heterozygous loci.'],
            ['Apply 2ⁿ rule: 2³ = 8 distinct gamete genotypes', '(ABCD, ABCd — wait: D is fixed, so ABCD, ABcD, AbCD, AbcD, aBCD, aBcD, abCD, abcD = 8 types!).'],
          ],
        },
        tryit: {
          q: 'In Mendel’s dihybrid cross between two pea plants heterozygous for both seed shape and seed colour (RrYy × RrYy), what fraction of the 16 Punnett combinations is HOMOZYGOUS RECESSIVE for BOTH traits (wrinkled green, rryy)?',
          o: ['1/16', '3/16', '9/16', '1/4'],
          a: 0,
          h: 'Multiply independent monohybrid probabilities: P(rr) = ¼ and P(yy) = ¼!',
          e: 'By independent probability, P(rryy) = P(rr) × P(yy) = ¼ × ¼ = 1/16 (from the 9 : 3 : 3 : 1 ratio totaling 16).',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Albinism in humans is caused by an autosomal recessive allele (a). If two normally pigmented carrier parents (Aa × Aa) have a child, what is the probability that the child will be an albino (aa)?', o: ['1/4 (25%)', '1/2 (50%)', '3/4 (75%)', '0%'], a: 0, e: 'Aa × Aa produces ¼ AA, ½ Aa (normal carriers), and ¼ aa (albino) — each pregnancy carries an independent 25% probability.' },
      { l: 2, q: 'Why did Gregor Mendel succeed brilliantly with garden pea (<i>Pisum sativum</i>) where earlier plant breeders failed?', o: ['Peas are naturally self-pollinating, have short generation time, produce large seed counts, and show sharp contrasting traits without intermediates', 'Peas have only one chromosome so crossing-over never occurs', 'Peas reproduce exclusively by vegetative stem tubers', 'Pea flowers cannot be artificially cross-pollinated by hand'], a: 0, e: '<i>Pisum sativum</i> offers cleistogamous self-pollination (easy pure-breeding lines), easy emasculation for controlled crosses, high seed output, and 7 clear-cut unlinked/loosely linked traits.' },
      { l: 3, q: 'A black rabbit of unknown genotype (B_) is mated with a white recessive rabbit (bb), producing 6 black kits and 5 white kits. What are the genotypes of the parents?', o: ['Bb × bb', 'BB × bb', 'Bb × Bb', 'BB × Bb'], a: 0, e: 'Appearance of recessive white (bb) offspring proves BOTH parents contributed a recessive b allele; since one parent is black, its genotype must be Bb (a classic 1:1 test cross).' },
      { l: 4, q: 'Two normally pigmented parents already have three albino children. What is the probability that their FOURTH child will ALSO be an albino?', o: ['1/4 (25%) — each fertilization is an independent probabilistic event', '0% — the 3:1 ratio guarantees the next three children must be normal', '100% — both parents must be homozygous aa', '3/4 (75%)'], a: 0, e: 'Classic JAMB probability trap! Past children prove both normal parents are Aa carriers, and every new pregnancy still has an independent ¼ (25%) chance of aa.' },
      { l: 4, q: 'Mendel’s Second Law (Independent Assortment) breaks down and fails to yield a 9 : 3 : 3 : 1 F₂ ratio when the two genes under study:', o: ['Are closely linked on the SAME chromosome', 'Show complete dominance over their respective recessive alleles', 'Control seed colour and stem height on separate chromosomes', 'Are tested in animals rather than flowering plants'], a: 0, e: 'Genes located close together on the same chromosome (linked genes) tend to be inherited together as a unit rather than assorting independently at metaphase I.' },
      { l: 5, q: 'In poultry, black-feathered (BB) crossed with splashed-white (WW) produces 100% blue-grey Andalusian fowls (BW) in F₁. If two Andalusian fowls are mated and 80 chicks hatch, how many are expected to be pure black (BB)?', o: ['20 chicks', '40 chicks', '60 chicks', '0 chicks'], a: 0, e: 'BW × BW gives 1 BB (black) : 2 BW (Andalusian blue) : 1 WW (white). Pure black BB = ¼ × 80 = 20 chicks.' },
    ],
  },

  // 23. Chromosomes, Sex-Linkage, ABO/Rhesus Blood Groups & Sickle-Cell
  {
    id: 'b-sex-linkage',
    name: 'Sex-Linkage, ABO/Rhesus Blood & Sickle-Cell',
    sec: 'SS 3 · First Term · Continuity of Life',
    boss: 'Blood Groups, Sex-Linkage & Sickle-Cell Test',
    goals: [
      'Solve X-linked recessive pedigrees (haemophilia, red-green colour blindness) and explain why fathers NEVER transmit X-linked traits to their sons',
      'Work out ABO multiple-allele / co-dominant blood group crosses (Iᴬ, Iᴮ, i), Rhesus erythroblastosis fetalis, and sickle-cell HbᴬHbˢ malaria heterozygote advantage',
    ],
    trap: 'A father ALWAYS gives his Y chromosome to his SON and his X chromosome to his DAUGHTER — therefore a boy NEVER inherits X-linked colour blindness or haemophilia from his FATHER (it ALWAYS comes from his MOTHER)!',
    parts: [
      {
        title: 'Sex Determination (XX / XY) & X-Linked Recessive Inheritance',
        idea: 'Human somatic cells have 46 chromosomes (22 pairs of autosomes + 1 pair of sex chromosomes: XX in females, XY in males); because the short Y chromosome lacks loci for X-borne genes, males express single recessive X alleles (XʰY, XᶜY) immediately!',
        rules: [
          'Sperm determines child’s sex (50% X-sperm : 50% Y-sperm; all ova carry X!).',
          'X-linked recessive traits: Red-green colour blindness (Xᶜ) & Haemophilia (“bleeder’s disease” — lack of clotting Factor VIII, Xʰ).',
          'Why males are affected far more often than females: a male needs ONLY ONE recessive allele (XᶜY, from his mother), whereas a female needs TWO (XᶜXᶜ — affected father AND carrier/affected mother)!',
        ],
        ex: {
          q: 'A woman with normal vision whose father was red-green colour-blind marries a man with normal vision. Find the probability that (a) a son is colour-blind, and (b) a daughter is colour-blind.',
          steps: [
            ['Deduce mother’s genotype: she has normal vision (Xᴺ_) and received Xᶜ from her colour-blind father (XᶜY) → she MUST be a carrier XᴺXᶜ!', 'Husband has normal vision → XᴺY.'],
            ['Cross XᴺXᶜ × XᴺY → Daughters: ½ XᴺXᴺ, ½ XᴺXᶜ (0% colour-blind!); Sons: ½ XᴺY (normal), ½ XᶜY (colour-blind!)', '(a) 50% of sons colour-blind (25% of all children); (b) 0% of daughters colour-blind!'],
          ],
        },
        tryit: {
          q: 'A haemophiliac man (XʰY) marries a homozygous normal non-carrier woman (XᴴXᴴ). What will be the genotypes and phenotypes of their children?',
          o: [
            'All sons will be completely normal (XᴴY) and all daughters will be phenotypically normal carriers (XᴴXʰ)',
            'All sons will be haemophiliac (XʰY) and all daughters will be non-carriers (XᴴXᴴ)',
            '50% of sons and 50% of daughters will suffer from severe haemophilia',
            'All daughters will be haemophiliac because fathers pass X chromosomes only to sons',
          ],
          a: 0,
          h: 'Every son gets Y from Dad and Xᴴ from Mum; every daughter gets Xʰ from Dad and Xᴴ from Mum!',
          e: 'XʰY × XᴴXᴴ produces 100% normal non-carrier sons (XᴴY) and 100% phenotypically normal carrier daughters (XᴴXʰ).',
        },
      },
      {
        title: 'ABO & Rhesus Blood Groups + Sickle-Cell Malaria Advantage',
        idea: 'ABO blood groups are controlled by MULTIPLE ALLELES (3 alleles: Iᴬ, Iᴮ, i) where Iᴬ and Iᴮ are CO-DOMINANT to each other and both are completely dominant over recessive i.',
        rules: [
          'Genotypes & Antigens/Antibodies: Group A (IᴬIᴬ or Iᴬi; antigen A on RBC, anti-b in plasma); Group B (IᴮIᴮ or Iᴮi; antigen B, anti-a); Group AB (IᴬIᴮ; BOTH antigens A & B, NO anti-a/anti-b → UNIVERSAL RECIPIENT); Group O (ii; NO A/B antigens on RBC, both anti-a & anti-b → UNIVERSAL DONOR).',
          'Paternity exclusion: Group AB parent (IᴬIᴮ) can NEVER have a Group O (ii) child! Two Group O parents (ii × ii) can ONLY have Group O children!',
          'Rhesus incompatibility (Erythroblastosis fetalis / haemolytic disease of newborn): occurs ONLY when a Rhesus-NEGATIVE mother (dd) carries a Rhesus-POSITIVE foetus (Dd, from Rh+ father) — 1st Rh+ baby sensitizes mother at birth to make anti-Rh antibodies, which cross the placenta to haemolyse 2nd+ Rh+ babies!',
          'Sickle-cell anaemia: HbᴬHbᴬ = normal (susceptible to severe cerebral malaria); HbˢHbˢ = sickle-cell anaemia (point mutation Glu → Val on β-globin; crisis in low O₂); HbᴬHbˢ = sickle-cell TRAIT carrier (healthy + resistant to severe Plasmodium falciparum malaria!).',
        ],
        ex: {
          q: 'A mother has blood group A and her baby has blood group O. Two men claim paternity: Man 1 is blood group AB, and Man 2 is blood group B. Resolve the dispute genetically.',
          steps: [
            ['Baby is Group O → genotype MUST be ii (received one i allele from Mother and one i allele from Father!)', 'Mother must therefore be heterozygous Group A (Iᴬi).'],
            ['Man 1 (Group AB = IᴬIᴮ) has NO i allele to give → EXCLUDED with 100% certainty!', 'Man 2 (Group B) could be heterozygous Iᴮi and contribute i — genetics excludes Man 1 and shows Man 2 COULD be the father (DNA profiling confirms).'],
          ],
        },
        tryit: {
          q: 'Under which parental Rhesus combination is a second pregnancy at risk of haemolytic disease of the newborn (erythroblastosis fetalis) if anti-D prophylaxis was not given?',
          o: [
            'Rhesus-negative mother (Rh⁻) and Rhesus-positive father (Rh⁺)',
            'Rhesus-positive mother (Rh⁺) and Rhesus-negative father (Rh⁻)',
            'Rhesus-negative mother (Rh⁻) and Rhesus-negative father (Rh⁻)',
            'Rhesus-positive mother (Rh⁺) and Rhesus-positive father (Rh⁺)',
          ],
          a: 0,
          h: 'Only an Rh⁻ mother lacks D antigen and can form anti-Rh IgG antibodies when sensitized by an Rh⁺ foetus!',
          e: 'When an Rh⁻ mother carries an Rh⁺ foetus (inherited from an Rh⁺ father), foetal RBCs entering maternal blood at the first delivery sensitize her to produce anti-D IgG that crosses the placenta in subsequent Rh⁺ pregnancies.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'A man of blood group A (heterozygous, Iᴬi) marries a woman of blood group B (heterozygous, Iᴮi). Which ABO blood groups are possible among their children?', o: ['All four blood groups: AB, A, B, and O (25% each)', 'Blood group AB only', 'Blood groups A and B only', 'Blood groups AB and O only'], a: 0, e: 'Iᴬi × Iᴮi yields ¼ IᴬIᴮ (AB), ¼ Iᴬi (A), ¼ Iᴮi (B), and ¼ ii (O) — all four ABO phenotypes!' },
      { l: 2, q: 'Why can a person of blood group O Rh⁻ donate packed red blood cells safely in an emergency to recipients of groups A, B, AB, or O?', o: ['Group O Rh⁻ erythrocytes lack A, B, and Rhesus D surface antigens, so recipient plasma antibodies have nothing to agglutinate', 'Group O plasma contains neither anti-a nor anti-b antibodies', 'Group O red blood cells destroy recipient antibodies upon contact', 'Group O genotype is co-dominant IᴬIᴮ'], a: 0, e: 'Agglutination in transfusion occurs when recipient plasma antibodies attack DONOR red-cell antigens; Group O Rh⁻ RBCs carry zero A, B, or Rh-D antigens.' },
      { l: 3, q: 'Why does the sickle-cell allele (Hbˢ) remain at relatively high frequency across West Africa despite the high mortality of homozygous HbˢHbˢ individuals without medical care?', o: ['Heterozygous carriers (HbᴬHbˢ) enjoy a selective survival advantage against lethal <i>Plasmodium falciparum</i> malaria', 'Tropical sunlight mutates Hbᴬ into Hbˢ every generation in skin cells', 'Hbˢ is completely dominant over Hbᴬ and increases lung capacity', 'Mosquitoes refuse to bite homozygous HbˢHbˢ individuals'], a: 0, e: 'Balanced polymorphism (heterozygote advantage): parasitized HbᴬHbˢ red cells sickle prematurely and are cleared by the spleen before <i>Plasmodium</i> completes schizogony.' },
      { l: 3, q: 'Before marriage, two healthy young Nigerians who are both sickle-cell carriers (genotype AS × AS) seek genetic counselling. What percentage of their children is expected on average to suffer from full sickle-cell anaemia (SS)?', o: ['25% (1 in 4)', '50% (1 in 2)', '75% (3 in 4)', '0%'], a: 0, e: 'HbᴬHbˢ × HbᴬHbˢ gives 25% AA (normal), 50% AS (carrier), and 25% SS (sickle-cell anaemia).' },
      { l: 4, q: 'Inheritance of ABO blood groups in humans demonstrates TWO non-Mendelian genetic concepts simultaneously, namely:', o: ['Multiple allelism (Iᴬ, Iᴮ, i) and Co-dominance (between Iᴬ and Iᴮ)', 'Sex-linkage on the Y chromosome and Incomplete dominance', 'Polygenic continuous inheritance and Cytoplasmic maternal inheritance', 'Epistasis and Lethal autopolyploidy'], a: 0, e: 'Three alleles occupy the single I locus in the population (multiple allelism), while Iᴬ and Iᴮ express both A and B antigens fully side-by-side in heterozygotes (co-dominance).' },
      { l: 5, q: 'In birds, butterflies, and moths (ZW / ZZ sex system), how does chromosomal sex determination differ from mammals?', o: ['The FEMALE is heterogametic (ZW / XO-like) and determines offspring sex, whereas the male is homogametic (ZZ)', 'Both males and females are XX and temperature alone sets sex', 'Males are haploid (n) arising from unfertilized eggs like honeybee drones', 'Sperm carry W or Z chromosomes while all ova carry Z'], a: 0, e: 'In birds and Lepidoptera, males are homogametic (ZZ) and females are heterogametic (ZW), so the ovum determines chick sex!' },
    ],
  },

  // 24. Molecular Genetics — DNA Replication, Protein Synthesis, Meiosis & Biotechnology
  {
    id: 'b-dna-biotech',
    name: 'DNA, Protein Synthesis, Meiosis & Biotech',
    sec: 'SS 3 · First Term · Continuity of Life',
    boss: 'DNA, Transcription, Meiosis & Biotech Test',
    goals: [
      'Apply Watson–Crick double-helix structure and Chargaff’s base-pairing rules (A=T with 2 H-bonds, G≡C with 3 H-bonds; Uracil replaces Thymine in RNA)',
      'Trace transcription → mRNA codon translation, contrast Meiosis (4 genetically varied haploid n gametes, crossing-over at Prophase I) with Mitosis, and apply recombinant DNA biotechnology',
    ],
    trap: 'In RNA, URacil (U) replaces Thymine (T) — so template DNA base ADENINE (A) pairs with URACIL (U) on mRNA (whereas template Thymine T still pairs with Adenine A)!',
    parts: [
      {
        title: 'DNA Double Helix, Chargaff’s Rule & Transcription/Translation',
        idea: 'Each nucleotide consists of a pentose sugar (deoxyribose in DNA; ribose in RNA), a phosphate group, and a nitrogenous base; DNA strands run antiparallel (5′→3′ / 3′→5′) and replicate semi-conservatively.',
        rules: [
          'Purines (double-ring): Adenine (A) & Guanine (G). Pyrimidines (single-ring): Cytosine (C), Thymine (T — DNA only), Uracil (U — RNA only).',
          'Chargaff’s Rule in double-stranded DNA: %A = %T (2 hydrogen bonds) and %G = %C (3 hydrogen bonds — higher GC% = higher melting stability!), with (%A + %T + %G + %C) = 100%.',
          'Central Dogma: DNA → (Transcription by RNA polymerase in nucleus) → mRNA → (Translation on cytoplasmic RIBOSOMES with tRNA anticodons) → Polypeptide chain. Every 3 mRNA bases = 1 CODON = 1 amino acid (triplet degenerate non-overlapping code; AUG = start / Met).',
        ],
        ex: {
          q: 'Chemical analysis of a double-stranded bacterial DNA sample shows 22% Cytosine. Calculate %G, %A, and %T, and write the mRNA codon transcribed from template DNA triplet 3′-TAC-5′.',
          steps: [
            ['By G ≡ C base pairing: %Guanine = %Cytosine = 22%', 'Together G + C = 44% of all bases.'],
            ['Remaining A + T = 100% − 44% = 56%  ⇒  %Adenine = 28% and %Thymine = 28%', 'Always check 22 + 22 + 28 + 28 = 100%!'],
            ['Template DNA 3′-TAC-5′ transcribes to mRNA 5′-AUG-3′', 'T→A, A→U (NOT T in RNA!), C→G — AUG is the universal start codon!'],
          ],
        },
        tryit: {
          q: 'A coding region of mature mRNA (excluding the stop codon) is 450 nucleotides long. How many amino acids will be linked into the resulting polypeptide chain?',
          o: ['150 amino acids', '1,350 amino acids', '450 amino acids', '225 amino acids'],
          a: 0,
          h: 'Every consecutive triplet (3 nucleotides = 1 codon) specifies exactly 1 amino acid!',
          e: 'Number of amino acids = 450 mRNA nucleotides ÷ 3 bases per codon = 150 amino acids.',
        },
      },
      {
        title: 'Meiosis (Reduction Division) & Modern Biotechnology',
        idea: 'Meiosis consists of TWO nuclear divisions following ONE DNA replication, halving diploid (2n) germ cells into FOUR genetically distinct haploid (n) gametes and generating variation via Prophase I crossing-over and Metaphase I independent assortment.',
        rules: [
          'Prophase I hallmarks (UNIQUE to meiosis!): Synapsis (homologous chromosomes pair into bivalents/tetrads) + CROSSING-OVER at CHIASMATA (swapping non-sister chromatid segments!).',
          'Anaphase I separates HOMOLOGOUS CHROMOSOMES (centromeres stay intact — ploidy drops 2n → n!); Anaphase II splits centromeres and separates sister chromatids (like mitosis).',
          'Recombinant DNA technology (genetic engineering): Restriction endonuclease (“molecular scissors”) cuts human insulin gene & bacterial plasmid → DNA ligase (“molecular glue”) seals recombinant plasmid → transformed E. coli synthesizes pure human insulin!',
          'Other Biotech applications: Tissue culture / micropropagation (cloning disease-free cassava/oil palm), DNA fingerprinting (forensics & paternity), Bt pest-resistant crops, gene therapy.',
        ],
        ex: {
          q: 'State THREE fundamental differences between Mitosis and Meiosis in an animal with 2n = 46.',
          steps: [
            ['Daughter cells: Mitosis yields 2 diploid (2n = 46) identical somatic cells; Meiosis yields 4 haploid (n = 23) genetically varied gametes', 'Halves chromosome number so fertilization restores 2n!'],
            ['Synapsis & Chiasmata: Absent in mitosis; present in Prophase I of meiosis', 'Creates novel recombinant allele combinations.'],
            ['Divisions per DNA replication: 1 in mitosis; 2 (Meiosis I & II) in meiosis', 'Occurs exclusively in gonads (testes/ovaries) or sporangia.'],
          ],
        },
        tryit: {
          q: 'During which exact stage of meiosis do homologous chromosomes pair up (synapsis) and exchange genetic segments at chiasmata (crossing-over)?',
          o: [
            'Prophase I',
            'Anaphase I',
            'Metaphase II',
            'Telophase II',
          ],
          a: 0,
          h: 'Crossing-over happens right at the start of the first meiotic division!',
          e: 'Synapsis (bivalent formation) and genetic recombination across chiasmata occur exclusively during Prophase I of meiosis.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Which three chemical components join together to form a single DNA nucleotide?', o: ['Deoxyribose pentose sugar, a phosphate group, and a nitrogenous base (A, T, G, or C)', 'Ribose sugar, an amino acid, and glycerol', 'Glucose hexose sugar, a fatty acid, and uracil', 'Peptide bond, sulphur atom, and ATP'], a: 0, e: 'A DNA nucleotide comprises 2-deoxyribose sugar, a phosphate group at C-5′, and one of Adenine, Thymine, Guanine, or Cytosine at C-1′.' },
      { l: 2, q: 'If 18% of the nitrogenous bases in a double-stranded human DNA molecule are Adenine (A), what percentage of the bases is Guanine (G)?', o: ['32%', '18%', '36%', '64%'], a: 0, e: '%A = 18% ⇒ %T = 18% (A + T = 36%). Remaining G + C = 100 − 36 = 64% ⇒ %G = 64 ÷ 2 = 32%.' },
      { l: 3, q: 'In recombinant DNA engineering of human insulin inside <i>Escherichia coli</i>, which pair of enzymes acts respectively as “molecular scissors” and “molecular glue”?', o: ['Restriction endonuclease and DNA ligase', 'DNA helicase and Salivary amylase', 'RNA polymerase and Trypsin', 'Reverse transcriptase and Catalase'], a: 0, e: 'Restriction endonucleases cleave DNA at specific palindromic recognition sites, and DNA ligase joins the human gene into the cut bacterial plasmid vector.' },
      { l: 3, q: 'If a template DNA strand reads 3′-GCT AAG-5′, what is the base sequence of the complementary mRNA strand synthesized during transcription?', o: ['5′-CGA UUC-3′', '5′-CGA TTC-3′', '5′-GCU AAG-3′', '5′-TAG CCG-3′'], a: 0, e: 'Pairing DNA → mRNA: G→C, C→G, T→A, A→U, A→U, G→C gives 5′-CGA UUC-3′ (remember RNA uses U, never T!).' },
      { l: 4, q: 'Non-disjunction (failure of chromosome pair 21 to separate properly during maternal or paternal meiosis) resulting in zygotes with 47 chromosomes (Trisomy 21) causes:', o: ['Down syndrome', 'Sickle-cell anaemia', 'Red-green colour blindness', 'Kwashiorkor'], a: 0, e: 'Meiotic non-disjunction of autosome 21 produces an n = 24 gamete; fertilization with a normal n = 23 gamete yields Trisomy 21 (47 chromosomes, Down syndrome).' },
      { l: 5, q: 'Which RNA molecule is folded into a clover-leaf shape bearing a specific 3-base ANTICODON at one end and a specific amino acid attached at its 3′ end?', o: ['Transfer RNA (tRNA)', 'Messenger RNA (mRNA)', 'Ribosomal RNA (rRNA)', 'Viral genomic DNA'], a: 0, e: 'tRNA acts as the molecular adaptor during translation, matching its anticodon to the mRNA codon on the ribosome to deliver the correct amino acid.' },
    ],
  },

  // 25. Variation — Morphological, Physiological, Discontinuous vs Continuous & Fingerprints
  {
    id: 'b-variation',
    name: 'Variation, Fingerprints & Mutations',
    sec: 'SS 3 · Second Term · Continuity of Life',
    boss: 'Continuous vs Discontinuous Variation Test',
    goals: [
      'Classify traits into morphological vs physiological AND continuous (polygenic + environment, bell-shaped curve) vs discontinuous (single-gene distinct classes, bar chart)',
      'Apply variation to crime forensics (fingerprints: arch, loop, whorl, compound), blood transfusion, paternity, and chromosomal/gene mutations',
    ],
    trap: 'Tongue rolling, ABO/Rhesus blood groups, sex, and fingerprint main classes are DISCONTINUOUS physiological/morphological traits (you either can or cannot roll your tongue — NO intermediates!), whereas height, weight, and skin colour are CONTINUOUS!',
    parts: [
      {
        title: 'Continuous vs Discontinuous & Morphological vs Physiological Variation',
        idea: 'Morphological variation concerns visible physical form/structure (height, weight, eye/skin/hair colour, fingerprint pattern), whereas physiological variation concerns internal biochemical/functional behaviour (ABO blood group, PTC tasting, tongue rolling, sickle-cell genotype).',
        rules: [
          'CONTINUOUS Variation (Height, body mass, skin colour, intelligence, leaf length, cob length): controlled by MANY genes (polygenic) + strongly modified by ENVIRONMENT (nutrition, sunlight); shows full range of intermediates forming a smooth normal BELL-SHAPED CURVE (histogram).',
          'DISCONTINUOUS Variation (ABO blood group, Rhesus factor, Sex, Tongue rolling, Ability to taste PTC, Albinism, Ear-lobe attachment): controlled by 1 or 2 major genes; unaffected by environment; sharp distinct categories with NO intermediates (plotted as discrete BAR CHART).',
          'Main human fingerprint classes (forensics): Arch, Loop, Whorl, and Compound — remain 100% UNCHANGED from birth to death (even identical twins have slightly different ridge minutiae!).',
        ],
        ex: {
          q: 'Classify each human trait as (i) Morphological or Physiological AND (ii) Continuous or Discontinuous: (a) Body height, (b) ABO blood group, (c) Ability to taste phenylthiocarbamide (PTC).',
          steps: [
            ['(a) Body height → Morphological AND Continuous', 'Measurable external dimension showing every intermediate millimetre from shortest to tallest.'],
            ['(b) ABO blood group & (c) PTC tasting → Physiological AND Discontinuous', 'Biochemical/sensory traits with clear-cut discrete categories (A/B/AB/O; taster vs non-taster) unaffected by diet.'],
          ],
        },
        tryit: {
          q: 'Which of the following sets of human characteristics consists EXCLUSIVELY of discontinuous variations?',
          o: [
            'ABO blood group, ability to roll the tongue, biological sex, and albinism',
            'Body height, body weight, skin complexion, and foot length',
            'Hand span, intelligence quotient, chest circumference, and blood group',
            'Skin colour, tongue rolling, body mass, and running speed',
          ],
          a: 0,
          h: 'Check that NONE of the items in the list has continuous intermediate measurements!',
          e: 'Blood group (A, B, AB, O), tongue rolling (roller vs non-roller), sex, and albinism fall into discrete qualitative classes with zero intermediates.',
        },
      },
      {
        title: 'Genetic vs Environmental Causes of Variation & Mutations',
        idea: 'Meiotic crossing-over, independent assortment, random fertilization, and MUTATION create heritable genetic variation; environmental differences (sunlight, soil fertility, nutrition) produce non-heritable phenotypic plasticity (somaclonal/acquired traits).',
        rules: [
          'Somatic mutation (e.g. UV skin cell mutation) affects ONLY that individual and is NOT inherited; Germinal (gametic) mutation in testis/ovary IS passed to offspring!',
          'Mutagens (agents increasing mutation rate): X-rays, gamma rays, ultraviolet radiation, mustard gas, nitrous acid, colchicine, benzene.',
          'Colchicine inhibits spindle fibre formation during cell division, inducing POLYPLOIDY (3n, 4n, 6n — e.g. hexaploid bread wheat, larger seedless triploid watermelons/bananas!).',
        ],
        ex: {
          q: 'Two cuttings taken from the exact same cassava stem (identical genotype!) grow to 2.4 m height in fertile loamy soil with sunlight, vs 0.8 m with yellow leaves in shaded sandy soil. If cuttings from the stunted plant are replanted in fertile sunny soil, how will they grow?',
          steps: [
            ['Stunting was purely ENVIRONMENTAL variation (non-heritable modification)', 'DNA sequence of the clone remained completely unchanged.'],
            ['Replanted in fertile sunny soil, they grow tall and vigorous (~2.4 m) again', 'Acquired environmental modifications are NOT inherited!'],
          ],
        },
        tryit: {
          q: 'In agricultural plant breeding, treating dividing meristematic buds with the alkaloid colchicine produces giant, high-yielding polyploid crop varieties because colchicine:',
          o: [
            'Prevents mitotic spindle fibre formation so duplicated chromosome sets remain inside a single nucleus (doubling ploidy from 2n to 4n)',
            'Dissolves the nuclear envelope and destroys half of the plant’s chromosomes',
            'Converts cellulose cell walls into animal chitin to resist locust attack',
            'Replaces thymine with uracil throughout chloroplast DNA',
          ],
          a: 0,
          h: 'Without spindle microtubules at anaphase, sister chromatids cannot pull apart into two nuclei!',
          e: 'Colchicine arrests spindle assembly at metaphase/anaphase, doubling chromosome sets (autopolyploidy/allopolyploidy) for larger vigorous polyploid crops.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'When the heights of 500 SS 3 students are measured and plotted as a frequency distribution graph, the resulting curve is typically:', o: ['A smooth normal bell-shaped curve showing continuous variation', 'Two isolated vertical bars with zero values in between', 'A horizontal flat line with zero variance', 'A J-shaped exponential bacterial crash curve'], a: 0, e: 'Polygenic traits influenced by environment (height, weight) cluster symmetrically around the mean in a normal Gaussian bell curve.' },
      { l: 2, q: 'Which of the following is an example of PHYSIOLOGICAL variation in humans?', o: ['Ability or inability to taste bitter phenylthiocarbamide (PTC) paper', 'Pattern of loops, arches, and whorls on fingertips', 'Presence or absence of facial dimples and cleft chin', 'Difference in ear-lobe attachment and nose bridge width'], a: 0, e: 'PTC tasting, tongue rolling, and ABO blood groups reflect internal biochemical/receptor function (physiological), whereas fingerprints, dimples, and earlobes are structural (morphological).' },
      { l: 3, q: 'Why can fingerprint impressions lifted from a glass cup at a crime scene identify a suspect conclusively even 30 years later?', o: ['Dermal friction-ridge patterns are genetically unique to each individual and never change pattern from birth until decomposition after death', 'Fingerprints change shape every five years to record a person’s diet and age', 'Only criminals possess whorl and compound fingerprint patterns', 'Fingerprint sweat contains intact nucleated red blood cells'], a: 0, e: 'Epidermal friction ridges (arches, loops, whorls, compounds) are permanently fixed during foetal development and regenerate identically unless deep dermis is scarred.' },
      { l: 3, q: 'Turner syndrome (45, XO sterile female) and Klinefelter syndrome (47, XXY sterile male) are examples of:', o: ['Chromosomal numerical mutations (aneuploidy) caused by meiotic non-disjunction of sex chromosomes', 'Point base-substitution mutations on autosome 11', 'Purely environmental nutritional deficiencies curable with Vitamin B₁₂', 'Normal discontinuous Mendelian traits with 3:1 ratios'], a: 0, e: 'Non-disjunction of sex chromosomes produces gametes with 0 or 2 sex chromosomes, yielding XO (45, Turner) or XXY (47, Klinefelter).' },
      { l: 4, q: 'Why are triploid (3n) cultivated bananas and seedless watermelons sterile (unable to produce viable seeds sexually) and propagated vegetatively by suckers/cuttings?', o: ['Three homologous chromosomes per set cannot pair evenly at Prophase I / Anaphase I of meiosis, producing unbalanced non-viable gametes', 'Triploid plants lack flowers, stamens, and carpels completely', 'Pollen tubes dissolve instantly upon touching a triploid stigma', 'Triploid cells cannot undergo mitosis to form roots and leaves'], a: 0, e: 'Odd-numbered ploidy (3n, 5n) undergoes normal mitosis for lush vegetative fruit growth, but uneven trivalent segregation in meiosis causes gametic sterility (seedlessness!).' },
      { l: 5, q: 'Which genetic event is the ULTIMATE primary source of brand-new alleles that never previously existed in a species’ gene pool?', o: ['Gene mutation (alteration in DNA nucleotide base sequence)', 'Random fusion of existing gametes during fertilization', 'Independent assortment of intact chromosomes at Metaphase I', 'Self-pollination of homozygous pure-breeding lines'], a: 0, e: 'Crossing-over, independent assortment, and fertilization reshuffle EXISTING alleles into new combinations, whereas ONLY mutation creates brand-new alleles!' },
    ],
  },

  // 26. Adaptation for Survival, Colouration, Social Insects & Behavioural Biology
  {
    id: 'b-adaptation',
    name: 'Adaptations, Colouration & Social Insects',
    sec: 'SS 3 · Second Term · Continuity of Life',
    boss: 'Mimicry, Behaviour & Social Insects Test',
    goals: [
      'Distinguish cryptic camouflage, countershading (Tilapia), aposematic warning colouration, and Batesian vs Müllerian mimicry',
      'Compare aestivation vs hibernation, innate taxes/nasties, courtship behaviour, and division of labour in social insects (termites Macrotermes & honeybees Apis)',
    ],
    trap: 'AESTIVATION is summer/dry-season dormancy to escape HEAT & DROUGHT (African lungfish Protopterus in mud cocoon, giant land snail), whereas HIBERNATION is winter dormancy to escape EXTREME COLD!',
    parts: [
      {
        title: 'Adaptive Colouration, Mimicry & Seasonal Dormancy',
        idea: 'Prey and predators evolve structural, physiological, and behavioural adaptations: camouflage hides organisms against backgrounds, countershading flattens 3D shadows in fish, and mimicry copies dangerous models.',
        rules: [
          'Cryptic colouration (camouflage): green praying mantis/grasshopper on green grass; chameleon chromatophore colour change matching background.',
          'Countershading in fish (Tilapia, Shark): DARK dorsal back (blends with dark river bottom when viewed from above by kingfishers) + SILVERY-WHITE ventral belly (blends with bright sky surface when viewed from below!).',
          'Warning (aposematic) colouration: bright black-and-yellow/red patterns on genuinely venomous wasps, coral snakes, or toxic monarch butterflies.',
          'Batesian mimicry: a HARMLESS palatable mimic (e.g. hoverfly, viceroy/swallowtail mimic) resembles a venomous/unpalatable model to deceive predators! Aestivation = dry-season torpor (lungfish, snail); Hibernation = cold-winter torpor (polar bear, temperate bats/hedgehogs).',
        ],
        ex: {
          q: 'Explain how the African lungfish (Protopterus annectens) survives for 6 months when seasonal pools in northern Nigeria dry completely into baked cracked mud.',
          steps: [
            ['Burrows into soft mud before water dries and secretes a waterproof mucus cocoon lined with a breathing tube', 'Enters AESTIVATION (dry-season dormancy).'],
            ['Switches from gills to air-breathing swim-bladder “lungs” and drastically lowers metabolic rate', 'Emerges when rainy-season floods soften the mud cocoon!'],
          ],
        },
        tryit: {
          q: 'A harmless, stingless hoverfly possesses bold yellow-and-black abdominal stripes almost indistinguishable from a venomous wasp, causing insectivorous birds to avoid eating it. This illustrates:',
          o: [
            'Batesian mimicry',
            'Countershading',
            'Disruptive courtship display',
            'Aestivation',
          ],
          a: 0,
          h: 'Harmless edible species mimicking a dangerous/unpalatable model = Batesian!',
          e: 'In Batesian mimicry, a palatable, defenceless species evolves the warning signals of a noxious or venomous model so experienced predators leave it alone.',
        },
      },
      {
        title: 'Social Insects (Termites & Honeybees) & Courtship Behaviour',
        idea: 'Eusocial insects live in integrated colonies showing polymorphic CASTE DIVISION OF LABOUR, overlapping generations, cooperative brood care, and chemical/dance communication.',
        rules: [
          'Termite mound (Macrotermes — Isoptera, incomplete metamorphosis): (1) Winged Reproductives (Alates) swarm after rain, shed wings along suture, pair as KING & giant physogastric QUEEN (lays >30,000 eggs/day; King stays to fertilize her periodically!); (2) Sterile blind wingless WORKERS (build termitarium, forage wood, cultivate fungus gardens, feed queen/soldiers/nymphs!); (3) Sterile blind wingless SOLDIERS (huge sclerotized mandibles or chemical nasute snout to defend colony — must be fed by workers!).',
          'Honeybee hive (Apis mellifera — Hymenoptera, complete metamorphosis): (1) ONE fertile diploid QUEEN (2n, fed royal jelly throughout larval life; mates once on nuptial flight); (2) Thousands of sterile diploid female WORKERS (2n — clean cells, nurse larvae, build wax comb, guard entrance, forage nectar/pollen, perform Karl von Frisch’s WAGGLE DANCE to indicate food distance & sun angle!); (3) Fertile HAPLOID male DRONES (n — develop by PARTHENOGENESIS from unfertilized eggs; sole role = mate with virgin queen!).',
          'Courtship behaviour (Agama head-bobbing, peacock tail fan, toad croaking, firefly bioluminescence): ensures species-specific recognition, synchronizes gamete readiness, suppresses aggression, and pairs fit mates.',
        ],
        ex: {
          q: 'Contrast the sex/chromosomal status of sterile workers in a honeybee hive vs sterile workers in a termite mound, and state what happens to drone honeybees.',
          steps: [
            ['Honeybee workers are ALL sterile diploid FEMALES (2n); Drones are fertile HAPLOID MALES (n) hatched from unfertilized eggs', 'Parthenogenesis (arrhenotoky) produces male drones!'],
            ['Termite workers and soldiers include BOTH sterile diploid males AND sterile diploid females', 'Also termites retain a permanent King beside the Queen, whereas honeybee drones die upon mating or are driven out in scarcity!'],
          ],
        },
        tryit: {
          q: 'In a honeybee (Apis mellifera) colony, which caste develops parthenogenetically from UN-FERTILIZED haploid eggs (n)?',
          o: [
            'Fertile male drones',
            'Sterile female worker bees',
            'The fertile queen bee',
            'Mandibulate soldier bees',
          ],
          a: 0,
          h: 'Fertilized diploid eggs (2n) become queens (royal jelly) or female workers (bee bread); unfertilized eggs (n) become...?',
          e: 'Male honeybees (drones) are haploid (n), developing by parthenogenesis from unfertilized eggs laid by the queen.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Why are soldier termites with massive crushing mandibles unable to survive if isolated from worker termites in a dish of dry wood?', o: ['Their enlarged defensive mandibles cannot chew wood for food, so they depend completely on workers to feed them regurgitated/digested food', 'Soldier termites lack spiracles and depend on workers to fan oxygen into their lungs', 'Soldiers are haploid drones that die within two hours of hatching', 'Only the queen termite possesses symbiotic gut protozoa'], a: 0, e: 'Extreme morphological specialization of soldier jaws for defence prevents self-feeding; blind sterile workers must feed soldiers, nymphs, and the queen.' },
      { l: 2, q: 'The dark greyish-black dorsal back and silvery-white ventral belly of <i>Tilapia</i> and mackerel represent which protective adaptation?', o: ['Countershading', 'Batesian mimicry', 'Warning aposematic colouration', 'Seasonal aestivation'], a: 0, e: 'Countershading conceals pelagic fish from both aerial predators looking down into dark water and aquatic predators looking up toward the bright surface.' },
      { l: 3, q: 'When a scout worker honeybee returns to a dark vertical honeycomb and performs a figure-of-eight “waggle dance” (Karl von Frisch), she communicates to fellow foragers:', o: ['Both the distance and the directional angle (relative to the sun) of a rich nectar/pollen source', 'That the old queen has died and drones must lay haploid eggs', 'That temperatures have dropped below freezing for winter hibernation', 'A courtship display inviting drones inside the hive to mate'], a: 0, e: 'Round dance signals food close to the hive (<50 m), whereas the waggle dance encodes both distance (waggle duration) and direction relative to the sun (angle from vertical).' },
      { l: 3, q: 'Structural adaptations of birds (Aves) for efficient powered flight include all of the following EXCEPT:', o: ['Heavy solid marrow-filled bones and a large urinary bladder storing liquid urine', 'Hollow pneumatic bones, keeled sternum anchoring pectoral muscles, and streamlined contour feathers', 'Modification of forelimbs into wings and fusion of caudal vertebrae into a pygostyle', 'Air sacs extending from lungs for unidirectional airflow and lack of heavy jaw teeth'], a: 0, e: 'Birds minimize body weight for flight by having hollow pneumatic bones, no teeth (horny beak), single left ovary, and NO urinary bladder (excreting semisolid uric acid).' },
      { l: 4, q: 'Rapid folding of the leaflets of sensitive plant (<i>Mimosa pudica</i>) within one second of being touched regardless of touch direction is an example of:', o: ['Haptonastic (seismonastic) turgor movement', 'Positive phototropism mediated by slow auxin growth', 'Chemotaxis of motile gametes', 'Geotropism of primary roots'], a: 0, e: 'Nastic movements are non-directional reversible turgor changes (pulvinus water loss at leaflet bases in <i>Mimosa</i>), unlike slow directional growth tropisms.' },
      { l: 5, q: 'In an <i>Agama</i> lizard territory around a sunny wall, the dominant male displays a bright orange-red head and blue-black trunk while females and subordinate males remain dull brown primarily for:', o: ['Territorial defence against rival males and courtship attraction of receptive females', 'Cryptic camouflage against green rainforest moss', 'Thermoregulatory hibernation during harmattan snow', 'Batesian mimicry of venomous cobras'], a: 0, e: 'Sexual dimorphism and head-bobbing displays in male rainbow lizards (<i>Agama agama</i>) advertise territorial dominance and attract females during breeding.' },
    ],
  },

  // 27. Theories of Evolution — Lamarck, Darwin-Wallace Natural Selection & Evidence
  {
    id: 'b-evolution',
    name: 'Organic Evolution — Lamarck, Darwin & Evidence',
    sec: 'SS 3 · Second Term · Continuity of Life',
    boss: 'Lamarck, Darwin & Evolutionary Evidence Test',
    goals: [
      'Contrast Jean-Baptiste Lamarck’s disproved inheritance of acquired characters with Charles Darwin & Alfred Russel Wallace’s Natural Selection (Neo-Darwinism)',
      'Evaluate anatomical, fossil, embryological, and contemporary evidence for evolution (homologous pentadactyl limbs vs analogous wings, vestigial organs, peppered moth melanism, antibiotic/insecticide resistance)',
    ],
    trap: 'HOMOLOGOUS structures share a COMMON evolutionary ancestor/plan despite different functions (whale flipper, bat wing, human arm = divergent evolution!), whereas ANALOGOUS structures have DIFFERENT origins performing the same job (insect wing vs bird wing = convergent evolution)!',
    parts: [
      {
        title: 'Lamarckism vs Darwin–Wallace Natural Selection & Neo-Darwinism',
        idea: 'Lamarck proposed that organs stretched by “use and disuse” during an organism’s lifetime are passed on to offspring (disproved by August Weismann’s mouse-tail experiment!); Darwin & Wallace showed that pre-existing heritable variations give differential survival and reproduction (“survival of the fittest”).',
        rules: [
          'Why Lamarckism fails: somatic acquired traits (blacksmith’s muscles, docked dog tails, sunburn) do NOT alter DNA in gametes! Weismann cut off tails of mice for >20 generations — every baby mouse was still born with a full-length tail!',
          'Darwin’s 4 pillars of Natural Selection: (1) Overproduction of offspring; (2) Constancy of population size → Struggle for existence (competition, predation, disease); (3) Heritable Variation among individuals; (4) Differential survival & reproduction of better-adapted variants (“natural selection”) passing advantageous alleles to offspring.',
          'Neo-Darwinism (Modern Synthesis): integrates Darwinian natural selection with Mendelian genetics, DNA mutation, meiotic recombination, genetic drift, and reproductive isolation (speciation).',
        ],
        ex: {
          q: 'Contrast how Lamarck vs Darwin would explain the evolution of long necks in modern giraffes from short-necked ancestors.',
          steps: [
            ['Lamarck (INCORRECT): Short-necked giraffes stretched their necks daily to reach high acacia leaves, and passed slightly stretched necks to calves', 'Relies on non-heritable acquired somatic stretching.'],
            ['Darwin (CORRECT): Ancestral giraffe populations already had heritable genetic variation in neck length; during drought when low shrubs were stripped, longer-necked variants survived starvation and left more offspring', 'Alleles for longer necks increased in frequency generation after generation!'],
          ],
        },
        tryit: {
          q: 'Repeated spraying of DDT against Anopheles mosquitoes in a district initially killed 99% of mosquitoes, but five years later DDT killed fewer than 15%. According to Neo-Darwinism, why did this happen?',
          o: [
            'DDT acted as a selective agent killing susceptible mosquitoes while rare pre-existing DDT-resistant mutants survived and multiplied to dominate the population',
            'Each individual mosquito consciously learned to digest DDT and taught its larvae how to detoxify it',
            'DDT chemically mutated every mosquito’s somatic wing muscles without killing any individuals',
            'Spraying DDT caused spontaneous generation of resistant mosquitoes from stagnant mud',
          ],
          a: 0,
          h: 'Natural selection selects PRE-EXISTING random genetic mutants — organisms never mutate “on purpose” in response to poison!',
          e: 'Rare mosquitoes already carrying a random detoxifying allele survived DDT exposure and reproduced abundantly, shifting allele frequencies in the gene pool.',
        },
      },
      {
        title: 'Lines of Evidence for Organic Evolution',
        idea: 'Independent lines of evidence — Paleontology (fossils & radioactive dating), Comparative Anatomy (homologous, analogous, vestigial), Comparative Embryology, Molecular Biochemistry, and Biogeography — converge on descent with modification.',
        rules: [
          'Fossil record: oldest strata hold simplest prokaryotes → fishes → amphibians → reptiles → birds & mammals! Archaeopteryx = transitional “missing link” fossil showing REPTILIAN traits (teeth in jaws, clawed wings, long bony tail) + AVIAN traits (feathers, wishbone)!',
          'HOMOLOGOUS structures (Divergent evolution / Adaptive radiation): Pentadactyl forelimb in human (grasping), whale/seal (swimming flipper), bat/bird (flying wing), horse (running), mole (digging) — SAME bone plan (humerus, radius, ulna, carpals, metacarpals, phalanges)!',
          'ANALOGOUS structures (Convergent evolution): Butterfly chitinous wing vs Bird feathered bony wing — completely different embryonic/anatomical origins adapted independently to flight.',
          'Vestigial organs (reduced functionless remnants of functional ancestral organs): human vermiform appendix (large cellulose caecum in herbivores), coccyx (tail), nictitating membrane (plica semilunaris), wisdom teeth; pelvic girdle remnants in whales & pythons.',
        ],
        ex: {
          q: 'During the 19th-century Industrial Revolution in Manchester, dark (melanic) peppered moths (Biston betularia) replaced pale speckled moths in soot-blackened woodlands, then reversed after Clean Air Acts. Explain.',
          steps: [
            ['Unpolluted pale lichen-covered bark camouflaged pale moths while birds ate conspicuous dark mutants', 'Clean air favoured the pale allele.'],
            ['Coal soot killed lichens and blackened trunks → dark melanic moths became camouflaged while birds ate pale moths (Industrial Melanism!)', 'Direct real-time observation of directional natural selection by selective bird predation!'],
          ],
        },
        tryit: {
          q: 'The forelimb of a human, the pectoral flipper of a whale, and the wing of a fruit bat all share the exact same humerus–radius–ulna–carpal–phalangeal bone pattern despite serving grasping, swimming, and flying. They are:',
          o: [
            'Homologous structures illustrating divergent evolution from a common pentadactyl ancestor',
            'Analogous structures illustrating convergent evolution from unrelated phyla',
            'Vestigial structures scheduled to disappear in the next generation',
            'Lamarckian acquired modifications caused by ocean currents',
          ],
          a: 0,
          h: 'Same underlying ancestral anatomy + different ecological functions = Homologous (divergent)!',
          e: 'Homologous pentadactyl limbs demonstrate adaptive radiation (divergent evolution) from a shared tetrapod ancestor.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'August Weismann’s classic experiment — cutting off the tails of mice for over 20 consecutive generations and observing that offspring were still born with normal tails — directly disproved:', o: ['Lamarck’s theory of inheritance of acquired characteristics', 'Darwin’s principle of natural selection', 'Mendel’s first law of allelic segregation', 'Watson and Crick’s semi-conservative DNA model'], a: 0, e: 'Weismann distinguished immortal germ plasm (gametes) from mortal somatoplasm, proving somatic mutilations/acquisitions are never inherited.' },
      { l: 2, q: 'The fossil <i>Archaeopteryx lithographica</i> provides compelling paleontological evidence that modern birds evolved directly from:', o: ['Toothed reptiles (theropod dinosaurs)', 'Cartilaginous elasmobranch fishes', 'Placental flying squirrels', 'Chitinouswinged insects'], a: 0, e: '<i>Archaeopteryx</i> combines avian contour feathers and wings with reptilian jaw teeth, wing claws, and a long unfused bony tail.' },
      { l: 3, q: 'The membranous chitinous wing of a dragonfly and the feathered bony wing of a sparrow perform identical flight functions yet have completely different anatomical origins, making them:', o: ['Analogous structures resulting from convergent evolution', 'Homologous structures resulting from divergent adaptive radiation', 'Vestigial structures inherited from amphibians', 'Allelic polymorphs within a single species'], a: 0, e: 'Unrelated lineages evolving superficially similar organs to solve the same physical challenge (flight) exhibit convergent evolution and analogous structures.' },
      { l: 3, q: 'Which of the following structures in the modern human body is classified as a VESTIGIAL organ?', o: ['Coccyx (fused caudal vertebrae) and vermiform appendix', 'Bicuspid mitral valve and sinoatrial node', 'Proximal convoluted tubule and glomerulus', 'Cochlea and semicircular canals'], a: 0, e: 'The coccyx (ancestral tail) and small vermiform appendix (ancestral herbivore caecum) are reduced evolutionary remnants.' },
      { l: 4, q: 'Arrange the major classes of vertebrates in the correct chronological sequence in which they first appeared in the geological fossil record (oldest → most recent):', o: ['Pisces (fishes) → Amphibia → Reptilia → Aves & Mammalia', 'Mammalia → Aves → Reptilia → Amphibia → Pisces', 'Amphibia → Pisces → Mammalia → Reptilia', 'Reptilia → Pisces → Aves → Amphibia'], a: 0, e: 'Jawless/jawed aquatic fishes appeared first in the Palaeozoic, giving rise to lobe-finned amphibians, then amniotic reptiles, and later birds and mammals.' },
      { l: 5, q: 'Early vertebrate embryos of fish, salamanders, tortoises, chicks, and humans all possess pharyngeal gill pouches and a post-anal tail at comparable early stages. This supports evolution through:', o: ['Comparative embryology indicating shared ancestral developmental genes', 'Spontaneous generation of mammals from adult pond fish', 'Convergent analogy between unrelated adult habitats', 'Artificial selection practised by hospital obstetricians'], a: 0, e: 'Conserved early embryonic structures (pharyngeal pouches, notochord, post-anal tail) across all chordates reflect shared ancestry modified during later ontogeny.' },
    ],
  },

  // 28. Plant Anatomy — Root, Stem & Leaf Transverse Sections + Secondary Thickening
  {
    id: 'b-plant-anatomy',
    name: 'Plant Anatomy — Root, Stem & Leaf Sections',
    sec: 'SS 3 · Third Term · Organization of Life',
    boss: 'Dicot vs Monocot Anatomy Test',
    goals: [
      'Identify transverse sections (TS) of dicot stem (vascular bundles in a ring + vascular cambium), monocot stem (scattered vascular bundles, no cambium), and dicot/monocot roots (star-shaped central xylem + endodermis)',
      'Relate internal leaf anatomy (waxy cuticle, upper epidermis, chloroplast-packed palisade mesophyll, airy spongy mesophyll, veins, lower guard cells) to photosynthesis and secondary thickening (annual rings)',
    ],
    trap: 'In a STEM, vascular bundles are conjoint/collateral (xylem & phloem together) — in a DICOT STEM they form a neat RING, whereas in a MONOCOT STEM they are SCATTERED; in a DICOT ROOT, central xylem forms a STAR-SHAPED (x-arch) core alternating radially with phloem!',
    parts: [
      {
        title: 'Transverse Sections (TS) of Dicot vs Monocot Stems & Roots',
        idea: 'Microscopic slide identification in WAEC practicals hinges on two instant visual checks: (1) Root hairs + central stele bounded by endodermis = ROOT; (2) Ring of open bundles with cambium = DICOT STEM vs scattered closed bundles in ground tissue = MONOCOT STEM.',
        rules: [
          'TS Young Dicot Stem (Sunflower, Talinum, Cowpea): Epidermis (with cuticle, multicellular hairs, NO root hairs) → Collenchyma hypodermis → Parenchyma cortex → Starch sheath → RING of vascular bundles (outer Phloem + VASCULAR CAMBIUM + inner Xylem = “open” bundle) + wide central Pith.',
          'TS Monocot Stem (Maize, Bamboo, Guinea grass): Sclerenchyma hypodermis + NUMEROUS SCATTERED closed vascular bundles throughout ground parenchyma; NO vascular cambium (so maize/palms generally lack true secondary cambial wood!) and NO distinct cortex/pith.',
          'TS Dicot Root (Bean, Buttercup): Epiblema/piliferous layer with unicellular ROOT HAIRS (no waxy cuticle!) → wide parenchyma cortex → ENDODERMIS with waterproof CASPARIAN STRIP → Pericycle (origin of lateral roots!) → central STAR-SHAPED (tetrarch, 2–5 arms) Xylem alternating radially with Phloem patches; NO pith (or tiny).',
          'TS Monocot Root (Maize): Polyarch vascular cylinder (MANY xylem arms, >8–12) surrounding a LARGE central pith!',
        ],
        ex: {
          q: 'On a WAEC practical microscope, Slide X shows unicellular epidermal hairs, a wide cortex, a distinct endodermis, and a 4-armed star of thick-walled xylem vessels in the very centre with phloem between the arms. Identify Slide X with two reasons.',
          steps: [
            ['Unicellular piliferous hairs + radial alternating xylem/phloem inside an endodermis → ROOT (not stem!)', 'Stem bundles are conjoint (phloem directly outside xylem on same radius).'],
            ['4-armed star-shaped xylem core (tetrarch) with no central pith → Transverse Section of a Young DICOTYLEDONOUS ROOT!', 'Monocot roots are polyarch (>8 arms) with a wide central pith.'],
          ],
        },
        tryit: {
          q: 'How can a student immediately distinguish a transverse section of a maize stem (monocot) from a sunflower stem (dicot) under low-power microscopy?',
          o: [
            'Maize stem has closed vascular bundles scattered throughout ground tissue without cambium, whereas sunflower stem has open vascular bundles arranged in a distinct ring with cambium',
            'Maize stem has a central four-armed star of xylem, whereas sunflower stem has scattered root hairs',
            'Maize stem contains wide annual growth rings of secondary wood, whereas sunflower lacks xylem',
            'Sunflower stem lacks pith and cortex completely, whereas maize has a single central bundle',
          ],
          a: 0,
          h: 'Monocot stem = scattered closed bundles; Dicot stem = neat ring of open bundles with vascular cambium!',
          e: 'Scattered closed vascular bundles (lacking cambium) in undifferentiated ground parenchyma uniquely identify a monocot stem.',
        },
      },
      {
        title: 'Internal Leaf Anatomy & Woody Secondary Thickening (Annual Rings)',
        idea: 'Dorsiventral dicot leaves concentrate cylindrical chloroplast-packed PALISADE MESOPHYLL cells directly beneath the transparent upper epidermis to capture maximum sunlight, while vascular cambium in woody dicot stems adds annual xylem rings.',
        rules: [
          'Leaf TS (top → bottom): Waxy cuticle (reduces evaporation; transparent!) → Upper epidermis (1 cell thick, NO chloroplasts!) → Palisade mesophyll (tightly packed vertical cells with MOST chloroplasts — main site of photosynthesis!) → Spongy mesophyll (irregular cells + large intercellular air spaces for CO₂/O₂ diffusion) → Lower epidermis with chloroplast-bearing GUARD CELLS & stomata.',
          'Note: Guard cells are the ONLY epidermal cells in a typical terrestrial leaf that contain chloroplasts!',
          'Secondary thickening in woody dicots: Vascular cambium divides to form SECONDARY XYLEM (wood) inward and secondary phloem outward. Wet rainy season → wide thin-walled spring/wet-season vessels; Dry season → narrow thick-walled vessels → 1 wet + 1 dry band = 1 ANNUAL GROWTH RING (counts tree age & past climate!).',
        ],
        ex: {
          q: 'Explain why the upper epidermis of a hibiscus leaf contains ZERO chloroplasts, yet the palisade mesophyll directly underneath performs over 75% of the leaf’s photosynthesis.',
          steps: [
            ['Upper epidermis + cuticle act as a transparent protective “skylight” window', 'Lack of chloroplasts allows sunlight to pass straight through without shading deeper layers.'],
            ['Cylindrical palisade cells stand vertically end-on with dense chloroplasts that circulate by cytoplasmic streaming', 'Maximizes photon absorption while minimizing cell-wall reflections.'],
          ],
        },
        tryit: {
          q: 'In the transverse section of a typical terrestrial dicotyledonous leaf, which cells are the ONLY cells of the epidermal layers that possess chloroplasts?',
          o: [
            'Bean-shaped guard cells bordering the stomata',
            'Ordinary pavement cells of the upper epidermis',
            'Dead lignified xylem tracheids inside the midrib vein',
            'Waxy non-cellular cuticle sheets',
          ],
          a: 0,
          h: 'Ordinary upper and lower epidermal cells are transparent and lack plastids!',
          e: 'Guard cells contain functional chloroplasts (supplying ATP/solutes for K⁺ uptake and turgor opening), whereas ordinary epidermal cells are colourless.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Lateral (branch) roots in vascular plants originate endogenously from deep inside the parent root specifically from the:', o: ['Pericycle just inside the endodermis', 'Outer piliferous root-hair layer', 'Waxy cuticular epidermis', 'Apical root cap calyptra'], a: 0, e: 'Lateral roots arise endogenously from meristematic division of the pericycle (unlike stem branches which arise exogenously from axillary buds).' },
      { l: 2, q: 'What is the physiological role of the waterproof suberized Casparian strip in the radial and transverse walls of root endodermal cells?', o: ['Forces apoplastic water and dissolved ions to cross a selectively permeable plasma membrane (symplast) before entering the xylem stele', 'Prevents glucose from leaking upward out of leaf stomata', 'Synthesizes chlorophyll when roots are exposed to darkness', 'Anchors root hairs to clay particles permanently'], a: 0, e: 'By blocking the passive cell-wall (apoplast) bypass at the endodermis, the Casparian strip gives living membranes strict control over which mineral ions enter xylem.' },
      { l: 3, q: 'Counting concentric annual rings on a freshly felled mahogany stump in southern Nigeria enables a forester to estimate the tree’s age because each annual ring represents:', o: ['Alternating wide rainy-season and narrow dry-season secondary xylem bands formed by vascular cambium', 'Concentric layers of suberized cork bark shed and replaced during each harmattan dry season', 'Scattered monocot phloem bundles added outward from the pericycle by root-hair pressure', 'Seasonal starch rings deposited inside central pith parenchyma cells during flowering'], a: 0, e: 'Cambial activity speeds up in wet seasons (large vessels, pale wood) and slows in dry seasons (small dense vessels, dark band), marking yearly growth cycles.' },
      { l: 3, q: 'Why can palm trees (oil palm, coconut — monocots) NOT be killed easily by shallow bark-ringing around the trunk, unlike mango or rubber trees (dicots)?', o: ['Closed vascular bundles containing phloem and xylem are scattered throughout the entire stem ground tissue', 'Adventitious palm roots synthesize chlorophyll underground without needing translocated leaf sucrose', 'Lignified sclerenchyma sheaths regenerate a new outer phloem ring within twenty-four hours of ringing', 'Monocot trunks transport sucrose downward exclusively through dead central heartwood vessels'], a: 0, e: 'In dicots, all phloem lies in a superficial ring just beneath the bark; in monocot palms, hundreds of closed vascular bundles lie deep inside the central ground tissue.' },
      { l: 4, q: 'In a dorsiventral dicot leaf, rapid diffusion of carbon(IV) oxide from open lower stomata up to the palisade cells is facilitated directly by:', o: ['Large interconnecting intercellular air spaces throughout the spongy mesophyll', 'Solid lignified sclerenchyma plates sealing the lower epidermis', 'Waterproof suberin lining every palisade chloroplast', 'Companion cells pumping gaseous CO₂ through phloem'], a: 0, e: 'Loosely packed spongy mesophyll cells create a labyrinth of moist air chambers linking substomatal cavities directly to palisade surfaces.' },
      { l: 5, q: 'Heartwood (duramen) at the centre of an old timber trunk differs from outer sapwood (alburnum) in that heartwood:', o: ['Consists of older non-conducting xylem plugged with dark tannins, resins, and gums that provide rigid decay-resistant mechanical support', 'Actively conducts 100% of transpiration water from roots to leaves', 'Consists of delicate thin-walled living meristematic cambium', 'Lacks lignin and rots faster than young sapwood'], a: 0, e: 'Outer pale sapwood conducts water & minerals, whereas central dark heartwood is clogged with antiseptic tannins/resins/tyloses for durable timber strength.' },
    ],
  },

  // 29. Biology of Soil, Water-Retention, Nitrogen Fixation & Crop Rotation
  {
    id: 'b-soil-agric',
    name: 'Biology of Soil, Fertility & Crop Rotation',
    sec: 'SS 3 · Third Term · The Organism & Its Environment',
    boss: 'Soil Types, Capillarity & Crop Rotation Test',
    goals: [
      'Compare particle size, porosity, aeration, water-retaining capacity, and capillarity across Sandy, Clay, and Loamy soils',
      'Calculate percentage soil water and humus (loss on ignition), and explain 4-year crop rotation, green manuring, liming, and earthworm fertility benefits',
    ],
    trap: 'CLAY soil has the HIGHEST ultimate capillarity height (tiny pores!) and HIGHEST water retention, but water rises FASTEST initially in SANDY/LOAM soil before stopping low!',
    parts: [
      {
        title: 'Sandy, Clay & Loamy Soil Properties + Soil Water/Humus Experiments',
        idea: 'Loamy soil is the ideal agricultural soil because it balances coarse sand (good drainage & root/microbial aeration), fine clay/silt (mineral cation retention & water-holding), and dark colloidal HUMUS (crumb structure + slow-release nutrients).',
        rules: [
          'SANDY soil (particles 0.02–2.0 mm): LARGE pore spaces → rapid drainage (high porosity/percolation), POOR water retention, LOW ultimate capillarity, well aerated, leaches minerals easily, light/easy to till.',
          'CLAY soil (particles < 0.002 mm): TINY pore spaces → POOR drainage (waterlogs easily!), HIGHEST water-retaining capacity, HIGHEST final capillary rise (very slow!), poorly aerated, heavy/sticky when wet & cracks hard when dry.',
          'Gravimetric soil experiments: (1) Heat weighed fresh soil at 105 °C (NOT red-hot!) to constant mass → mass loss = SOIL WATER (hygroscopic/capillary); (2) Heat that dry soil RED-HOT in a crucible to constant mass → second mass loss = ORGANIC HUMUS oxidized to CO₂ + H₂O vapour!',
        ],
        ex: {
          q: 'A fresh garden soil sample weighs 50.0 g. After drying in an oven at 105 °C to constant weight it weighs 40.0 g. When strongly ignited red-hot in a porcelain crucible and cooled, the residue weighs 36.0 g. Calculate (a) % water in fresh soil, and (b) % humus in dry soil.',
          steps: [
            ['Mass of water lost at 105 °C = 50.0 − 40.0 = 10.0 g', '% Water in fresh soil = (10.0 ÷ 50.0) × 100% = 20.0%.'],
            ['Mass of humus burnt off on red-hot ignition = 40.0 − 36.0 = 4.0 g', '% Humus in dry soil = (4.0 ÷ 40.0) × 100% = 10.0% (or 8.0% of fresh soil — state basis clearly!).'],
          ],
        },
        tryit: {
          q: 'Three long glass tubes plugged with cotton wool are packed to equal height with dry sand, dry loam, and dry clay, and stood upright in a trough of water for 48 hours. Which tube shows the HIGHEST final water column by capillarity?',
          o: [
            'Clay soil (finest capillary pores produce highest ultimate rise, though slowest initially)',
            'Coarse sandy soil (largest air spaces pull water highest after 48 hours)',
            'Pure gravel stones (zero resistance allows water to reach the top)',
            'All three tubes stop at the exact same height after 48 hours',
          ],
          a: 0,
          h: 'Capillary rise h is inversely proportional to pore radius r (finer pores = higher ultimate rise, though slower rate)!',
          e: 'Water rises fastest in sand during the first few minutes then stops low, whereas fine micropores in clay pull water slowly to the greatest ultimate height.',
        },
      },
      {
        title: 'Soil Conservation, Earthworms & 4-Course Crop Rotation',
        idea: 'Continuous monocropping exhausts specific mineral zones, multiplies host-specific pests/nematodes, and degrades soil crumb structure; rotating deep-rooted, shallow-rooted, and leguminous crops sustains fertility naturally.',
        rules: [
          'Rules of 4-Year Crop Rotation (e.g. Yam/Cassava → Maize → Cowpea/Groundnut → Fallow/Mucuna): (1) Include a LEGUME (Cowpea/Groundnut/Soybean with Rhizobium nodules) to replenish soil nitrates; (2) Alternate DEEP-ROOTED crops (Yam, Cassava, Cotton) with SHALLOW-ROOTED crops (Maize, Rice, Millet); (3) Never follow crops of the SAME family sharing pests/diseases!',
          'Earthworms (“farmer’s friends”): burrows aerate soil & improve drainage; drag dead leaves underground to increase humus; alkaline worm casts neutralize soil acidity and bind fine crumbs!',
          'Agricultural liming (adding CaO, Ca(OH)₂, or CaCO₃): neutralizes excessive soil acidity, flocculates heavy clay into friable crumbs, supplies Ca²⁺, and encourages nitrifying bacteria.',
        ],
        ex: {
          q: 'Why should oven drying of soil to determine moisture content NEVER exceed ~105 °C before weighing?',
          steps: [
            ['At 100–105 °C, free capillary and hygroscopic water evaporates cleanly without burning organic matter', 'Gives true water mass loss.'],
            ['Above ~150–200 °C, organic HUMUS chars and oxidizes into CO₂ gas', 'Would falsely inflate calculated water content and ruin subsequent humus measurement!'],
          ],
        },
        tryit: {
          q: 'Why MUST a leguminous crop such as cowpea or groundnut always be included in a well-designed four-year crop rotation schedule?',
          o: [
            'Symbiotic Rhizobium bacteria in its root nodules fix atmospheric nitrogen into nitrates, replenishing nitrogen depleted by cereal and root crops',
            'Legume roots secrete herbicides that permanently sterilize earthworms and soil fungi',
            'Legumes have no roots and absorb all their minerals directly from raindrops',
            'Legumes convert clay particles into coarse quartz sand within one growing season',
          ],
          a: 0,
          h: 'Cereals (maize) and tubers (yam) are heavy nitrogen feeders!',
          e: 'Legumes harbour nitrogen-fixing <i>Rhizobium</i> in root nodules, restoring soil nitrogen naturally when crop residues decompose.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Equal volumes (50 cm³) of dry sandy soil and water (50 cm³) are mixed thoroughly in a measuring cylinder and settle to a combined volume of 82 cm³ instead of 100 cm³. What was the percentage of air by volume in the dry soil?', o: ['36%', '18%', '82%', '50%'], a: 0, e: 'Volume of escaped air displaced from soil pores = (50 + 50) − 82 = 18 cm³. Percentage air in the 50 cm³ soil sample = (18 ÷ 50) × 100% = 36%!' },
      { l: 2, q: 'Adding slaked lime — Ca(OH)₂ — or powdered limestone to heavy acidic clay farmland improves crop yield in all the following ways EXCEPT:', o: ['Driving off soil nitrates as ammonia gas when mixed simultaneously with ammonium tetraoxosulphate(VI) fertilizer (a harmful loss!)', 'Neutralizing excess soil acidity to suit pH-sensitive crops and nitrifying bacteria', 'Flocculating sticky colloidal clay particles into porous, well-aerated crumbs', 'Supplying essential calcium ions for plant middle-lamella pectates'], a: 0, e: 'Never apply quicklime/slaked lime at the exact same time as ammonium fertilizers ((NH₄)₂SO₄), because OH⁻ reacts with NH₄⁺ to release gaseous NH₃↑, wasting nitrogen!' },
      { l: 3, q: 'Contour ploughing and terracing on steep hillside farms in Plateau or Enugu State are practised primarily to:', o: ['Check the velocity of surface rainwater run-off and prevent sheet and gully erosion of fertile topsoil', 'Accelerate leaching of soluble nitrates down into valley streams', 'Drain all capillary moisture out of sandy soils during harmattan', 'Eliminate earthworms from root zones'], a: 0, e: 'Ridges built along equal-elevation contours (perpendicular to slope) trap rainwater so it infiltrates gently instead of carving erosion gullies.' },
      { l: 3, q: 'Equal 60 g samples of dry sand, loam, and clay are placed in filter funnels over measuring cylinders, and 100 cm³ of water is poured onto each. After draining stops, filtrates measure: Funnel X = 82 cm³, Funnel Y = 58 cm³, Funnel Z = 32 cm³. Identify X, Y, and Z:', o: ['X = Sandy soil, Y = Loamy soil, Z = Clay soil', 'X = Clay soil, Y = Loamy soil, Z = Sandy soil', 'X = Loamy soil, Y = Clay soil, Z = Sandy soil', 'X = Clay soil, Y = Sandy soil, Z = Loamy soil'], a: 0, e: 'Water retained = 100 − Filtrate: X retains 18 cm³ (lowest → Sand); Y retains 42 cm³ (moderate ideal → Loam); Z retains 68 cm³ (highest → Clay).' },
      { l: 4, q: 'Why does unregulated bush burning just before planting harm long-term tropical soil fertility even though it leaves mineral-rich ash initially?', o: ['It destroys organic humus, kills beneficial earthworms and nitrifying microbes, volatilizes nitrogen/sulphur as gases, and exposes bare soil to rain erosion', 'Ash turns sandy soil permanently into impermeable granite rock', 'Fire converts atmospheric nitrogen into excess toxic protein', 'Heat forces earthworms to eat crop seeds'], a: 0, e: 'While ash supplies quick K⁺/Ca²⁺/PO₄³⁻, burning oxidizes humus and nitrogen/sulphur to gases, destroys soil structure, and kills decomposers.' },
      { l: 5, q: 'Mycorrhiza is a beneficial mutualistic association between:', o: ['Soil fungal hyphae and the roots of vascular plants (enhancing phosphate and water absorption)', 'Nitrogen-fixing cyanobacteria and mosquito larvae', 'Parasitic dodder (<i>Cuscuta</i>) stems and host phloem', 'Denitrifying bacteria and waterlogged clay'], a: 0, e: 'Mycorrhizal fungi extend effective root absorptive surface area enormously for phosphorus and water uptake in exchange for host plant carbohydrates.' },
    ],
  },

  // 30. Parasites, Vectors, Immunity & Major Tropical Diseases
  {
    id: 'b-public-health',
    name: 'Tropical Parasites, Vectors & Immunity',
    sec: 'SS 3 · Third Term · The Organism & Its Environment',
    boss: 'Vectors, Parasite Life Cycles & Immunity Test',
    goals: [
      'Match major tropical diseases to their causative pathogen AND specific biological vector (Malaria, Trypanosomiasis, Onchocerciasis, Schistosomiasis, Filariasis, Yellow Fever)',
      'Trace life cycles/adaptations of Taenia (tapeworm) and Schistosoma (blood fluke), and contrast Active vs Passive (Natural & Artificial) Immunity + WHO childhood vaccines',
    ],
    trap: 'RIVER BLINDNESS (Onchocerciasis) is caused by the filarial worm Onchocerca volvulus transmitted by the BLACKFLY (Simulium damnosum — breeds in fast-flowing oxygenated rivers!), NOT by tsetse fly or mosquito!',
    parts: [
      {
        title: 'Pathogens, Biological Vectors & Endoparasite Adaptations',
        idea: 'A biological vector is an arthropod or snail inside which a parasite develops/multiplies before transmission (e.g. female Anopheles for Plasmodium), whereas a housefly carrying cholera/typhoid on its feet/proboscis is a mechanical vector.',
        rules: [
          'Must-know Vector Matrix: (1) Malaria → protozoan Plasmodium spp., vector = FEMALE Anopheles mosquito; (2) Sleeping Sickness (Trypanosomiasis) → protozoan Trypanosoma gambiense/brucei, vector = TSETSE FLY (Glossina); (3) River Blindness (Onchocerciasis) → nematode Onchocerca volvulus, vector = BLACKFLY (Simulium damnosum); (4) Elephantiasis (Lymphatic filariasis) → Wuchereria bancrofti, vector = Culex / Anopheles mosquito; (5) Yellow Fever & Dengue → Arbovirus, vector = Aedes aegypti mosquito; (6) Bilharzia (Schistosomiasis) → trematode fluke Schistosoma haematobium/mansoni, intermediate host = freshwater SNAIL (Bulinus / Biomphalaria)!',
          'Tapeworm: Taenia solium = PORK tapeworm (scolex has 4 suckers + double crown of HOOKS; intermediate host = pig); Taenia saginata = BEEF tapeworm (4 suckers, NO hooks; intermediate host = cattle).',
          'Tapeworm adaptations to host ileum: hooks & suckers prevent peristaltic dislodgement; NO alimentary canal (absorbs pre-digested host nutrients across large flat body surface!); thick protective cuticle + anti-enzyme mucilage prevent digestion by host trypsin; hermaphrodite proglottids produce millions of eggs; tolerates anaerobic gut!',
        ],
        ex: {
          q: 'Why does draining stagnant domestic puddles reduce Malaria and Yellow Fever dramatically, yet fail to eliminate River Blindness (Onchocerciasis) in riverside farming communities?',
          steps: [
            ['Anopheles (malaria) and Aedes (yellow fever) breed in STILL/STAGNANT water pools, cans, and gutters', 'Draining stagnant water destroys mosquito larval habitats.'],
            ['Simulium damnosum (blackfly vector of Onchocerca volvulus) breeds exclusively on rocks/vegetation in FAST-FLOWING, well-oxygenated rivers and spillways!', 'Requires targeted river larviciding and ivermectin (Mectizan) community treatment.'],
          ],
        },
        tryit: {
          q: 'Which human parasitic infection is acquired WITHOUT an insect bite when fork-tailed cercaria larvae released by freshwater Bulinus snails penetrate bare skin directly while wading or swimming in contaminated ponds?',
          o: [
            'Schistosomiasis (Bilharzia — Schistosoma haematobium)',
            'African trypanosomiasis (Sleeping sickness)',
            'Onchocerciasis (River blindness)',
            'bancroftian elephantiasis',
          ],
          a: 0,
          h: 'Eggs passed in urine/faeces hatch into miracidia → infect freshwater Bulinus snails → release skin-penetrating cercariae!',
          e: '<i>Schistosoma</i> cercariae emerge from freshwater <i>Bulinus</i>/<i>Biomphalaria</i> snails and bore directly through human skin, maturing in pelvic/mesenteric veins (causing haematuria — blood in urine).',
        },
      },
      {
        title: 'Active vs Passive Immunity, Vaccines & Public Health',
        idea: 'ACTIVE immunity occurs when the person’s OWN lymphocytes encounter an antigen and manufacture antibodies + long-lived memory B/T cells (slow onset, LONG-LASTING); PASSIVE immunity transfers ready-made antibodies from outside (instant protection, SHORT-LIVED, NO memory cells!).',
        rules: [
          '1. Natural Active Immunity: recovering from an actual infection (e.g. measles, chickenpox) → lifelong memory lymphocytes!',
          '2. Artificial Active Immunity (VACCINATION / IMMUNIZATION): injecting attenuated/killed pathogen or toxoid (BCG against Tuberculosis, OPV/IPV against Polio, DPT against Diphtheria–Pertussis–Tetanus, Measles, Yellow fever) → body builds own memory cells!',
          '3. Natural Passive Immunity: maternal IgG crossing the PLACENTA to foetus + IgA antibodies in COLOSTRUM / breast milk protecting newborn!',
          '4. Artificial Passive Immunity: emergency injection of preformed ANTISERUM / ANTITOXIN (anti-snake venom serum, anti-tetanus serum ATS, anti-rabies immunoglobulin) → immediate neutralization, decays in weeks!',
        ],
        ex: {
          q: 'A farmer bitten on the ankle by a carpet viper receives anti-snake-venom serum in hospital, whereas his baby daughter receives oral polio vaccine (OPV) at the clinic. Classify both types of immunity and compare their duration.',
          steps: [
            ['Anti-snake venom serum = Artificial PASSIVE Immunity (preformed antibodies from immunized horses)', 'Acts immediately to save his life before venom kills, but lasts only a few weeks (zero memory cells formed).'],
            ['Oral Polio Vaccine (attenuated virus) = Artificial ACTIVE Immunity', 'Stimulates baby’s own B and T lymphocytes to form memory cells for years/decades of protection!'],
          ],
        },
        tryit: {
          q: 'Antibodies passed from a nursing mother to her newborn infant via yellowish colostrum (first breast milk) confer:',
          o: [
            'Natural passive immunity',
            'Artificial active immunity',
            'Artificial passive immunity',
            'Natural active immunity',
          ],
          a: 0,
          h: 'Did the baby’s own lymphocytes make the antibodies (active) or receive ready-made maternal antibodies naturally (natural passive)?',
          e: 'Ready-made maternal IgG (placental) and secretory IgA (colostrum/breast milk) provide immediate, non-medical protection without baby memory-cell synthesis: natural passive immunity.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Why do ONLY female <i>Anopheles</i> mosquitoes transmit human malaria whereas male <i>Anopheles</i> mosquitoes never transmit the disease?', o: ['Females require a vertebrate blood meal for protein to mature their eggs, whereas males feed harmlessly on plant nectar and fruit juices', 'Male mosquitoes carry <i>Trypanosoma</i> instead of <i>Plasmodium</i>', 'Female mosquitoes lack salivary glands so sporozoites enter through their feet', 'Male mosquitoes live entirely underwater throughout adult life'], a: 0, e: 'Male mosquitoes have plumose antennae and non-piercing proboscides adapted solely for nectar; blood-sucking females require haemoglobin/plasma proteins for oogenesis.' },
      { l: 2, q: 'BCG (Bacillus Calmette–Guérin) vaccine administered intradermally to newborn infants shortly after birth protects primarily against:', o: ['Tuberculosis (<i>Mycobacterium tuberculosis</i>)', 'Poliomyelitis', 'Yellow fever', 'Whooping cough (pertussis)'], a: 0, e: 'BCG is a live attenuated strain of <i>Mycobacterium bovis</i> conferring artificial active cell-mediated immunity against tuberculosis.' },
      { l: 3, q: 'Humans acquire pork tapeworm (<i>Taenia solium</i>) infection directly by:', o: ['Eating raw or undercooked “measly” pork containing encysted bladderworms (cysticerci)', 'Walking barefoot on damp soil contaminated with hookworm larvae', 'Being bitten at night by female <i>Culex</i> mosquitoes', 'Swimming in rivers inhabited by <i>Simulium</i> blackfly larvae'], a: 0, e: 'Pigs ingest human-shed proglottids/eggs → oncospheres encyst in pig muscle as bladderworms (<i>Cysticercus cellulosae</i>); eating undercooked pork releases the scolex in the human ileum.' },
      { l: 3, q: 'Which pair correctly links African Sleeping Sickness to its causative organism and biological insect vector?', o: ['<i>Trypanosoma gambiense</i> — Tsetse fly (<i>Glossina palpalis</i>)', '<i>Plasmodium malariae</i> — Female <i>Anopheles</i> mosquito', '<i>Wuchereria bancrofti</i> — Housefly (<i>Musca domestica</i>)', '<i>Vibrio cholerae</i> — Cockroach (<i>Periplaneta</i>)'], a: 0, e: 'Flagellate protozoan <i>Trypanosoma</i> causes human sleeping sickness (and cattle <i>nagana</i>), transmitted by blood-sucking <i>Glossina</i> tsetse flies.' },
      { l: 4, q: 'Human Immunodeficiency Virus (HIV) cripples the body’s acquired immune defence against opportunistic infections (like TB and candidiasis) because it selectively invades and destroys:', o: ['Helper T-lymphocytes (CD4⁺ T-cells)', 'Enucleated mature red blood cells', 'Blood platelets (thrombocytes)', 'Nephron podocytes in Bowman’s capsule'], a: 0, e: 'HIV is a retrovirus (using reverse transcriptase) that targets CD4⁺ helper T-lymphocytes, collapsing coordination of both antibody (B-cell) and cytotoxic immune responses.' },
      { l: 5, q: 'Why does a secondary immune response upon second exposure to the same pathogen occur much faster and produce a far higher antibody titre than the primary response?', o: ['Long-lived memory B and T lymphocytes formed during the primary exposure proliferate rapidly into plasma cells upon re-encountering the antigen', 'Antigens lose half their molecular weight during a second infection', 'Antibodies from the primary infection multiply by binary fission in plasma', 'Red blood cells convert into phagocytes after the first fever'], a: 0, e: 'Immunological memory (clonal expansion of memory B and T cells) eliminates the long lag phase of primary exposure, neutralizing the pathogen before symptoms develop.' },
    ],
  },
];
