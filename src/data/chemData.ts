// @ts-nocheck
import type { InteractiveLesson, Topic } from "../types";
import { fr, ch, MN, RA, EQM, mfix } from "../utils/mathMarkup";
import { mkR, perm } from "../utils/engine";
import { D } from "./diagrams";
import {
  CHEM_2027_EXTRA_QG,
  CHEM_2027_EXTRA_QS,
  CHEM_2027_PREPENDED_BEATS,
  CHEM_SYLLABUS_2027_META,
  CHEM_SYLLABUS_ORDER,
  NEW_CHEM_2027_DEFS,
  NEW_CHEM_2027_TOPICS,
} from "./chemSyllabus2027";
import {
  CHEM_NERDC_MAP,
  NERDC_EXTRA_DEFS,
  NERDC_EXTRA_TEACH,
  NERDC_EXTRA_TOPICS,
} from "./chemNerdc2027";

const CHEM = { subject: "Chemistry", topics: [] as Topic[] };
const QG: Record<string, any[]> = {};

const CDEF = {
  'c-sep': [
    { d: [['Element', `An element is a substance which cannot be split into simpler substances by an ordinary chemical process.`],
        ['Compound', `A compound is a substance which contains two or more elements chemically combined together in a fixed ratio by mass.`],
        ['Mixture', `A mixture contains two or more constituents which are not chemically combined and which can be separated by physical methods.`]],
      idea: `The constituents of a mixture keep their individual properties and may be present in any proportion. The elements in a compound are chemically combined, so the compound has properties different from those of the elements it contains.`,
      r: [`A compound has a fixed composition by mass. It can be separated into its elements only by chemical means.`,
        `A mixture can have any composition. Its constituents can be separated by physical methods.`,
        `A pure substance has a sharp, fixed melting point and boiling point. An impurity lowers the melting point and raises the boiling point.`] },
    { d: [['Filtration', `Filtration is the method used to separate an insoluble solid from a liquid. The solid that remains on the filter paper is the residue. The liquid that passes through is the filtrate.`],
        ['Evaporation', `Evaporation is the method used to recover a soluble solid from its solution by heating until all the solvent is driven off as vapour.`],
        ['Crystallisation', `Crystallisation is the method used to obtain a soluble salt from its solution when the salt decomposes easily on heating or contains water of crystallisation. The solution is heated until it is saturated, then left to cool so that crystals form.`],
        ['Distillation', `Distillation is the method used to recover a solvent from a solution. The solution is boiled and the vapour is condensed back to a liquid, called the distillate.`]],
      idea: `The method of separation depends on the physical property in which the constituents differ: particle size, solubility or boiling point.` },
    { d: [['Fractional distillation', `Fractional distillation is the method used to separate a mixture of two or more miscible liquids which have different boiling points, using a fractionating column.`],
        ['Chromatography', `Chromatography is a method of separating the constituents of a mixture by the different rates at which they move over an adsorbent medium, such as paper, in a moving solvent.`],
        [`R<sub>f</sub> value`, `The R<sub>f</sub> value of a substance is the ratio of the distance moved by the substance to the distance moved by the solvent front.`],
        ['Sublimation', `Sublimation is the process in which a solid changes directly to a gas on heating, without passing through the liquid state.`]],
      idea: '',
      r: [`Miscible liquids with different boiling points, such as ethanol and water, are separated by fractional distillation. Immiscible liquids, such as kerosene and water, are separated with a separating funnel.`,
        `R<sub>f</sub> = distance moved by the spot ÷ distance moved by the solvent front. It is always less than 1.`,
        `Sublimation separates a solid that sublimes, such as iodine or ammonium chloride, from one that does not.`] }
  ],
  'c-kin': [
    { d: [['Kinetic theory of matter', `The kinetic theory states that matter is made up of tiny particles (atoms, molecules or ions) which are in constant motion, and that the kinetic energy of the particles increases as the temperature rises.`],
        ['Diffusion', `Diffusion is the movement of particles from a region of higher concentration to a region of lower concentration as a result of their random motion.`]],
      idea: `In a solid the particles are closely packed and vibrate about fixed positions. In a liquid they are close together but free to move past one another. In a gas they are far apart and move rapidly at random.`,
      r: [`The pressure of a gas is caused by its particles colliding with the walls of the container.`,
        `Diffusion is fastest in gases, slower in liquids and slowest in solids.`,
        `At the same temperature, lighter particles move faster and diffuse faster than heavier ones.`] },
    { l: [[`Boyle's law`, `The volume of a fixed mass of gas is inversely proportional to its pressure, provided the temperature remains constant.<br>V ∝ ${fr(1, 'P')}, so PV = constant and P₁V₁ = P₂V₂.`],
        [`Charles' law`, `The volume of a fixed mass of gas is directly proportional to its absolute temperature, provided the pressure remains constant.<br>V ∝ T, so ${fr('V', 'T')} = constant and ${fr('V₁', 'T₁')} = ${fr('V₂', 'T₂')}.`],
        ['General gas equation', `For a fixed mass of gas, ${fr('PV', 'T')} = constant, so ${fr('P₁V₁', 'T₁')} = ${fr('P₂V₂', 'T₂')}.`]],
      d: [['Absolute zero', `Absolute zero, 0 K or −273 °C, is the temperature at which the volume of a gas would theoretically become zero. It is the lowest temperature possible.`],
        ['Standard temperature and pressure (s.t.p.)', `Standard temperature is 273 K (0 °C). Standard pressure is 760 mmHg, which is 1 atmosphere or 1.01 × 10⁵ N m⁻².`]],
      idea: '',
      r: [`Temperature must be in kelvin in every gas law: T (K) = temperature in °C + 273.`,
        `Use Boyle's law when the temperature is constant, and Charles' law when the pressure is constant.`,
        `Use the general gas equation when pressure, volume and temperature all change.`] },
    { l: [[`Graham's law of diffusion`, `At constant temperature and pressure, the rate of diffusion of a gas is inversely proportional to the square root of its density, or of its relative molecular mass.<br>${fr('R₁', 'R₂')} = √(${fr('M₂', 'M₁')})`]],
      idea: `Under the same conditions, a lighter gas diffuses faster than a denser gas.` }
  ],
  'c-atom': [
    { d: [['Atom', `An atom is the smallest particle of an element which can take part in a chemical reaction.`],
        ['Atomic number (proton number), Z', `The atomic number of an element is the number of protons in the nucleus of one atom of the element.`],
        ['Mass number (nucleon number), A', `The mass number of an atom is the sum of the protons and neutrons in its nucleus.`],
        ['Isotopy', `Isotopy is the existence of atoms of the same element which have the same atomic number but different mass numbers, because they contain different numbers of neutrons. Such atoms are called isotopes.`],
        ['Ion', `An ion is an atom or a group of atoms which carries an electric charge.`]],
      idea: `An atom consists of a small, dense, positively charged nucleus, containing protons and neutrons, surrounded by electrons in shells. A neutral atom has equal numbers of protons and electrons.`,
      r: [`Proton: relative charge +1, relative mass 1. Neutron: charge 0, mass 1. Electron: charge −1, mass about ${fr(1, 1840)}.`,
        `Number of neutrons = mass number − atomic number = A − Z.`,
        `Isotopes of an element have the same chemical properties, because they have the same number of electrons.`] },
    { d: [['Relative atomic mass, A<sub>r</sub>', `The relative atomic mass of an element is the number of times the average mass of one atom of the element is heavier than one-twelfth of the mass of one atom of carbon-12.`]],
      idea: `Most elements exist as a mixture of isotopes, so the relative atomic mass is a weighted average of the isotopic masses and is often not a whole number.` },
    { d: [['Electronic configuration', `The electronic configuration of an atom is the arrangement of its electrons in the shells and sub-levels (orbitals) around the nucleus.`]],
      l: [['Aufbau principle', `Electrons enter the orbitals in order of increasing energy. The orbital of lowest energy is filled first.`],
        [`Pauli exclusion principle`, `No two electrons in the same atom can have the same set of four quantum numbers. An orbital therefore holds a maximum of two electrons, and they must have opposite spins.`],
        [`Hund's rule of maximum multiplicity`, `Electrons occupy the orbitals of a sub-level singly, with parallel spins, before any pairing takes place.`]],
      idea: `The first shell holds a maximum of 2 electrons and the second 8. For the first 20 elements the shells fill in the order 2, 8, 8, 2.` }
  ],
  'c-per': [
    { l: [['Periodic law', `The properties of the elements are a periodic function of their atomic numbers.`]],
      d: [['Group', `A group is a vertical column of the periodic table. Elements in the same group have the same number of electrons in their outermost shells.`],
        ['Period', `A period is a horizontal row of the periodic table. Elements in the same period have the same number of electron shells.`]],
      idea: `In the modern periodic table the elements are arranged in order of increasing atomic number.`,
      r: [`Period number = number of electron shells. Group number = number of outer-shell electrons. Group 0 elements have full outer shells.`,
        `Elements in the same group have similar chemical properties.`,
        `Metals are on the left of the table and non-metals are on the right.`] },
    { d: [['First ionisation energy', `The first ionisation energy of an element is the minimum energy required to remove the most loosely bound electron from each atom in one mole of gaseous atoms, to form one mole of gaseous ions with a single positive charge.`],
        ['Electron affinity', `Electron affinity is the energy change when one mole of gaseous atoms gains one mole of electrons to form one mole of gaseous ions with a single negative charge.`],
        ['Electronegativity', `Electronegativity is the power of an atom in a molecule to attract the shared (bonding) electrons towards itself.`]] },
    { d: [['Displacement reaction', `A displacement reaction is one in which a more reactive element displaces a less reactive element from a solution of its compound.`]],
      idea: `The group I metals react with cold water to form an alkali and hydrogen. The halogens of group VII are reactive non-metals. The noble gases of group 0 have full outer shells and are unreactive.` }
  ],
  'c-bond': [
    { d: [['Electrovalent (ionic) bond', `An electrovalent bond is formed by the transfer of one or more electrons from a metallic atom to a non-metallic atom. The oppositely charged ions formed are held together by strong electrostatic forces of attraction.`]],
      l: [['Octet rule', `Atoms combine so as to attain the stable electron configuration of a noble gas: two electrons (a duplet) or eight electrons (an octet) in the outermost shell.`]],
      idea: '' },
    { d: [['Covalent bond', `A covalent bond is formed when two atoms share a pair of electrons, each atom contributing one electron to the shared pair.`],
        ['Dative (co-ordinate) covalent bond', `A dative bond is a covalent bond in which both electrons of the shared pair are donated by only one of the atoms. The donor atom must have a lone pair of electrons.`],
        ['Lone pair', `A lone pair is a pair of outer-shell electrons which is not used in bonding.`]],
      idea: `One shared pair of electrons is a single bond, two shared pairs a double bond and three shared pairs a triple bond.` },
    { d: [['Metallic bond', `A metallic bond is the electrostatic force of attraction between the positive metal ions and the sea of delocalised (mobile) valence electrons which surrounds them.`],
        ['Hydrogen bond', `A hydrogen bond is the intermolecular force of attraction between a hydrogen atom which is covalently bonded to a strongly electronegative atom (nitrogen, oxygen or fluorine) and the electronegative atom of a neighbouring molecule.`],
        ['Van der Waals forces', `Van der Waals forces are the weak forces of attraction which exist between the molecules of covalent substances.`]],
      idea: `The delocalised electrons explain why metals conduct electricity and heat. Hydrogen bonding explains why water has an unusually high boiling point for its molecular mass.`,
      r: [`Hydrogen bonds form only when hydrogen is bonded to fluorine, oxygen or nitrogen. They raise the boiling points of water, ammonia and ethanol.`,
        `Shapes of molecules: CH₄ is tetrahedral (109.5°), NH₃ is trigonal pyramidal (107°), H₂O is bent or V-shaped (104.5°), CO₂ is linear (180°).`,
        `A lone pair repels more strongly than a bonding pair, so lone pairs reduce the bond angle.`] }
  ],
  'c-mole': [
    { d: [['Mole', `A mole is the amount of a substance which contains as many elementary particles (atoms, molecules, ions or electrons) as there are atoms in exactly 12 g of carbon-12.`],
        ['Avogadro constant', `The Avogadro constant is the number of particles in one mole of a substance. Its value is 6.02 × 10²³ mol⁻¹.`],
        ['Relative molecular mass, M<sub>r</sub>', `The relative molecular mass of a substance is the number of times the average mass of one molecule of the substance is heavier than one-twelfth of the mass of one atom of carbon-12.`],
        ['Molar mass', `The molar mass of a substance is the mass of one mole of the substance, in grams per mole (g mol⁻¹). It is numerically equal to the relative atomic or molecular mass.`],
        ['Molar volume', `The molar volume of a gas is the volume occupied by one mole of the gas. At s.t.p. it is 22.4 dm³ for every gas.`]],
      l: [[`Avogadro's law`, `Equal volumes of all gases at the same temperature and pressure contain the same number of molecules.`]],
      idea: '' },
    { d: [['Empirical formula', `The empirical formula of a compound is the simplest formula, which shows the simplest whole-number ratio of the atoms of the elements present in the compound.`],
        ['Molecular formula', `The molecular formula of a compound shows the actual number of atoms of each element present in one molecule of the compound.`]],
      idea: `The molecular formula is a whole-number multiple of the empirical formula.` },
    { l: [['Law of conservation of mass', `Matter is neither created nor destroyed in the course of a chemical reaction, but changes from one form to another.`],
        ['Law of definite proportions (constant composition)', `All pure samples of a particular chemical compound contain the same elements combined in the same proportion by mass.`],
        ['Law of multiple proportions', `If two elements, A and B, combine to form more than one compound, the various masses of A which combine separately with a fixed mass of B are in a simple whole-number ratio.`],
        [`Gay-Lussac's law of combining volumes`, `When gases react, they do so in volumes which are in a simple whole-number ratio to one another and to the volumes of the products, if gaseous, provided the temperature and pressure remain constant.`]],
      d: [['Stoichiometry', `The stoichiometry of a reaction is the mole ratio in which the reactants combine and the products are formed, as shown by the balanced chemical equation.`]],
      idea: '',
      r: [`To calculate a reacting mass: find the moles of the substance you know, apply the mole ratio from the balanced equation, then convert to the mass or volume required.`,
        `For gases at the same temperature and pressure, the volumes that react are in the same ratio as the moles in the equation.`,
        `The total mass of the reactants equals the total mass of the products.`] }
  ],
  'c-acid': [
    { d: [['Acid', `An acid is a substance which produces hydrogen ions, H⁺, as the only positive ions when dissolved in water. In water the hydrogen ion exists as the hydroxonium ion, H₃O⁺.`],
        ['Base', `A base is a substance which neutralises an acid to form a salt and water only.`],
        ['Alkali', `An alkali is a base which is soluble in water. Its solution contains hydroxide ions, OH⁻.`],
        ['Brønsted–Lowry definition', `An acid is a proton donor and a base is a proton acceptor.`],
        ['Neutralisation', `Neutralisation is the reaction between an acid and a base to form a salt and water only. Ionically: H⁺ + OH⁻ ${RA} H₂O.`],
        ['Strong and weak acids', `A strong acid ionises completely in aqueous solution. A weak acid ionises only partially in aqueous solution.`],
        ['Basicity of an acid', `The basicity of an acid is the number of replaceable hydrogen ions in one molecule of the acid.`]],
      idea: '',
      r: [`Strong acids: HCl, H₂SO₄ and HNO₃. Weak acids: ethanoic acid and carbonic acid.`,
        `Acid + base ${RA} salt + water. Acid + carbonate ${RA} salt + water + carbon dioxide. Acid + reactive metal ${RA} salt + hydrogen.`,
        `HCl is monobasic (basicity 1), H₂SO₄ is dibasic (2) and H₃PO₄ is tribasic (3).`] },
    { d: [['pH', `The pH of a solution is the negative logarithm, to base 10, of its hydrogen ion concentration in mol dm⁻³: pH = −log₁₀[H⁺].`],
        ['Indicator', `An acid–base indicator is a weak organic acid or base whose colour depends on the pH of the solution it is in.`]],
      idea: `A solution with a pH below 7 is acidic, a solution of pH 7 is neutral, and a solution with a pH above 7 is alkaline. A change of one pH unit is a tenfold change in hydrogen ion concentration.` },
    { d: [['Salt', `A salt is a compound formed when all or part of the ionisable hydrogen of an acid is replaced by a metallic ion or an ammonium ion.`],
        ['Normal salt', `A normal salt is formed when all the replaceable hydrogen ions of an acid are replaced by metallic or ammonium ions. Examples: NaCl, Na₂SO₄.`],
        ['Acid salt', `An acid salt is formed when the replaceable hydrogen ions of an acid are only partially replaced by a metal. Example: NaHSO₄.`],
        ['Basic salt', `A basic salt contains hydroxide ions as well as the negative ions of the acid. Example: Zn(OH)Cl.`],
        ['Double salt', `A double salt ionises in solution to give two different kinds of positive ion. Example: potash alum, KAl(SO₄)₂·12H₂O.`]] }
  ],
  'c-vol': [
    { d: [['Titration', `Titration is a method of volumetric analysis in which a solution of known concentration is added from a burette to a measured volume of a solution of unknown concentration until the reaction between them is just complete.`],
        ['Standard solution', `A standard solution is a solution of accurately known concentration.`],
        ['End point', `The end point is the point in a titration at which the indicator just changes colour, showing that the reaction is complete.`]],
      idea: `A pipette measures a fixed volume of the alkali into a conical flask. The acid is added from a burette until the indicator just changes colour.` },
    { d: [['Molar concentration (molarity)', `The molar concentration of a solution is the amount of solute, in moles, dissolved in 1 dm³ of the solution. Its unit is mol dm⁻³.`],
        ['Mass concentration', `The mass concentration of a solution is the mass of solute, in grams, dissolved in 1 dm³ of the solution. Its unit is g dm⁻³.`],
        ['Molar solution', `A molar solution contains one mole of the solute in 1 dm³ of the solution.`]] }
  ],
  'c-redox': [
    { d: [['Oxidation', `Oxidation is the addition of oxygen to a substance, or the removal of hydrogen from it. In terms of electrons, oxidation is the loss of electrons. It results in an increase in oxidation number.`],
        ['Reduction', `Reduction is the removal of oxygen from a substance, or the addition of hydrogen to it. In terms of electrons, reduction is the gain of electrons. It results in a decrease in oxidation number.`],
        ['Redox reaction', `A redox reaction is one in which oxidation and reduction take place at the same time.`],
        ['Oxidising agent', `An oxidising agent is a substance which accepts electrons and is itself reduced.`],
        ['Reducing agent', `A reducing agent is a substance which donates electrons and is itself oxidised.`]],
      idea: '',
      r: [`Oxidation and reduction always occur together: the electrons lost by one substance are gained by another.`,
        `In Zn + Cu²⁺ ${RA} Zn²⁺ + Cu, zinc loses electrons and is oxidised, and Cu²⁺ gains electrons and is reduced. Zinc is the reducing agent and Cu²⁺ is the oxidising agent.`,
        `Common oxidising agents: O₂, Cl₂, KMnO₄, K₂Cr₂O₇ and concentrated HNO₃. Common reducing agents: H₂, C, CO, H₂S and reactive metals.`] },
    { d: [['Oxidation number', `The oxidation number of an element in a compound or ion is the electrical charge it appears to have, as determined by a set of arbitrary rules.`]],
      idea: `An increase in oxidation number is oxidation. A decrease in oxidation number is reduction.`,
      r: [`The oxidation number of an uncombined element is 0. The oxidation number of a simple ion is its charge.`,
        `In compounds, oxygen is −2 (−1 in peroxides), hydrogen is +1 (−1 in metal hydrides), group I metals are +1 and group II metals are +2.`,
        `The oxidation numbers in a neutral compound add up to 0. In an ion they add up to the charge on the ion. In IUPAC names the oxidation number is shown in Roman numerals: iron(III) chloride contains Fe at +3.`] }
  ],
  'c-elec': [
    { d: [['Electrolysis', `Electrolysis is the chemical decomposition of a compound brought about by the passage of a direct electric current through its solution or its molten form.`],
        ['Electrolyte', `An electrolyte is a compound which, in solution or in the molten state, conducts an electric current and is decomposed by it.`],
        ['Electrodes', `Electrodes are the conductors through which the current enters and leaves the electrolyte. The anode is the positive electrode. The cathode is the negative electrode.`]],
      idea: `During electrolysis, the positive ions (cations) migrate to the cathode, where they gain electrons. The negative ions (anions) migrate to the anode, where they lose electrons.`,
      r: [`Reduction takes place at the cathode: metal ions or H⁺ ions gain electrons.`,
        `Oxidation takes place at the anode: anions lose electrons, or the anode itself dissolves if it is an active metal.`,
        `Molten lead(II) bromide gives lead at the cathode and bromine at the anode.`] },
    { d: [['Preferential discharge of ions', `When two or more ions of the same charge are present at an electrode, one of them is discharged in preference to the others. The choice depends on three factors: the position of the ion in the electrochemical series, the concentration of the ion, and the nature of the electrode.`]],
      idea: `In an aqueous solution, water supplies H⁺ and OH⁻ ions in addition to the ions of the electrolyte.` },
    { l: [[`Faraday's first law of electrolysis`, `The mass of a substance liberated or deposited at an electrode during electrolysis is directly proportional to the quantity of electricity passed through the electrolyte.<br>m ∝ Q, where Q = It.`],
        [`Faraday's second law of electrolysis`, `When the same quantity of electricity is passed through different electrolytes, the numbers of moles of the elements discharged are inversely proportional to the charges on their ions.`]],
      d: [['Faraday', `One faraday is the quantity of electricity carried by one mole of electrons. It is equal to 96 500 coulombs.`]],
      idea: '' }
  ],
  'c-energy': [
    { d: [['Exothermic reaction', `An exothermic reaction is one in which heat is given out to the surroundings. Its enthalpy change, ΔH, is negative.`],
        ['Endothermic reaction', `An endothermic reaction is one in which heat is absorbed from the surroundings. Its enthalpy change, ΔH, is positive.`],
        ['Heat of reaction (enthalpy change), ΔH', `The heat of reaction is the amount of heat evolved or absorbed when a chemical reaction takes place between the molar quantities of the substances shown in the equation. ΔH = H<sub>products</sub> − H<sub>reactants</sub>.`],
        ['Activation energy', `Activation energy is the minimum energy which the reacting particles must possess before a reaction can take place.`]],
      idea: '' },
    { d: [['Heat of combustion', `The standard heat of combustion of a substance is the heat evolved when one mole of the substance is burned completely in oxygen under standard conditions.`],
        ['Heat of neutralisation', `The standard heat of neutralisation is the heat evolved when one mole of hydrogen ions from an acid reacts with one mole of hydroxide ions from an alkali to form one mole of water under standard conditions.`],
        ['Heat of solution', `The standard heat of solution is the heat evolved or absorbed when one mole of a substance is dissolved in so much water that further dilution causes no detectable heat change.`],
        ['Heat of formation', `The standard heat of formation of a compound is the heat evolved or absorbed when one mole of the compound is formed from its elements under standard conditions.`]],
      idea: `In the laboratory the heat is transferred to a known mass of water, and the temperature change of the water is measured.` },
    { d: [['Bond energy', `Bond energy is the average energy required to break one mole of a particular covalent bond in gaseous molecules.`],
        ['Entropy, S', `Entropy is a measure of the degree of disorder or randomness of a system.`],
        ['Free energy change, ΔG', `The free energy change of a reaction is given by ΔG = ΔH − TΔS. A reaction is spontaneous when ΔG is negative.`]],
      idea: `Every reaction involves breaking bonds in the reactants, which absorbs energy, and forming bonds in the products, which releases energy.`,
      r: [`ΔH = energy absorbed in breaking the bonds of the reactants − energy released in forming the bonds of the products.`,
        `If more energy is released than is absorbed, ΔH is negative and the reaction is exothermic.`,
        `A reaction is spontaneous when ΔG = ΔH − TΔS is negative. T is the temperature in kelvin.`] }
  ],
  'c-rate': [
    { d: [['Rate of reaction', `The rate of a chemical reaction is the change in the concentration of a reactant or a product per unit time.`],
        ['Activation energy', `Activation energy is the minimum energy which the colliding particles must possess before a reaction can take place.`],
        ['Catalyst', `A catalyst is a substance which alters the rate of a chemical reaction but remains chemically unchanged at the end of the reaction.`]],
      l: [['Collision theory', `For a reaction to occur, the reactant particles must collide. Only the collisions in which the particles possess energy equal to or greater than the activation energy result in a reaction. These are called effective collisions.`]],
      idea: '',
      r: [`Increasing the concentration of a reactant, or the pressure of a gas, increases the frequency of collisions and so increases the rate.`,
        `Increasing the temperature increases the rate, because the particles move faster and a greater proportion of them possess the activation energy. For many reactions a rise of 10 °C roughly doubles the rate.`,
        `Increasing the surface area of a solid increases the rate. A catalyst increases the rate by providing a route of lower activation energy.`] }
  ],
  'c-equil': [
    { d: [['Reversible reaction', `A reversible reaction is one which can proceed in both the forward and the backward directions under suitable conditions.`],
        ['Dynamic equilibrium', `A reversible reaction in a closed system is in dynamic equilibrium when the rate of the forward reaction is equal to the rate of the backward reaction, so that the concentrations of the reactants and products remain constant.`]],
      l: [['Equilibrium law', `For a reversible reaction at equilibrium at a constant temperature, the product of the concentrations of the products, each raised to the power of its number of moles in the equation, divided by the same product for the reactants, is a constant. This constant is the equilibrium constant, K<sub>c</sub>.`]],
      idea: '' },
    { l: [[`Le Chatelier's principle`, `If an external constraint, such as a change in temperature, pressure or concentration, is imposed on a chemical system in equilibrium, the equilibrium position shifts so as to annul or neutralise the constraint.`]],
      idea: '' }
  ],
  'c-sol': [
    { d: [['Solution', `A solution is a uniform (homogeneous) mixture of two or more substances. The solute is the substance that dissolves. The solvent is the substance in which it dissolves.`],
        ['Solubility', `The solubility of a solute in a solvent at a particular temperature is the maximum amount of the solute, in moles or grams, that will dissolve in 1 dm³ of the solvent at that temperature. It is also often expressed in grams of solute per 100 g of solvent.`],
        ['Saturated solution', `A saturated solution of a solute at a particular temperature is one which contains as much solute as it can dissolve at that temperature in the presence of undissolved solute.`],
        ['Unsaturated solution', `An unsaturated solution is one which can dissolve more solute at the same temperature.`],
        ['Supersaturated solution', `A supersaturated solution is one which contains more solute than it can normally hold at that temperature. It is unstable.`]],
      idea: '',
      r: [`The solubility of most solids increases as the temperature rises. The solubility of gases decreases as the temperature rises.`,
        `Mass of crystals deposited on cooling = solubility at the higher temperature − solubility at the lower temperature, for each 100 g of water.`,
        `Solubility in mol dm⁻³ = solubility in g dm⁻³ ÷ molar mass.`] },
    { d: [['Hard water', `Hard water is water which does not readily form a lather with soap.`],
        ['Soft water', `Soft water is water which readily forms a lather with soap.`],
        ['Temporary hardness', `Temporary hardness is hardness which can be removed by boiling. It is caused by dissolved calcium hydrogencarbonate or magnesium hydrogencarbonate.`],
        ['Permanent hardness', `Permanent hardness is hardness which cannot be removed by boiling. It is caused by dissolved calcium and magnesium sulphates and chlorides.`]],
      idea: `Hardness is caused by dissolved calcium ions and magnesium ions, which react with soap to form an insoluble scum.`,
      r: [`Boiling removes temporary hardness: Ca(HCO₃)₂ ${RA} CaCO₃ + H₂O + CO₂.`,
        `Boiling does not remove permanent hardness.`,
        `Both kinds of hardness are removed by adding washing soda (Na₂CO₃), by ion exchange or by distillation.`] },
    { d: [['Water of crystallisation', `Water of crystallisation is the definite amount of water with which some substances combine chemically when they crystallise from aqueous solution.`],
        ['Deliquescent substance', `A deliquescent substance absorbs so much water from the atmosphere that it dissolves in it to form a solution.`],
        ['Hygroscopic substance', `A hygroscopic substance absorbs moisture from the atmosphere without forming a solution.`],
        ['Efflorescent substance', `An efflorescent substance loses part or all of its water of crystallisation to the atmosphere when it is exposed to air.`]],
      idea: '',
      r: [`Deliquescent substances: sodium hydroxide, calcium chloride and magnesium chloride.`,
        `Hygroscopic substances: concentrated sulphuric acid, calcium oxide and silica gel. They are used as drying agents.`,
        `Efflorescent substance: washing soda, Na₂CO₃·10H₂O.`] }
  ],
  'c-air': [
    {},
    { d: [['Oxide', `An oxide is a compound of oxygen with one other element.`],
        ['Acidic oxide', `An acidic oxide is an oxide of a non-metal which reacts with water to form an acid, and with an alkali to form a salt and water only.`],
        ['Basic oxide', `A basic oxide is an oxide of a metal which reacts with an acid to form a salt and water only.`],
        ['Amphoteric oxide', `An amphoteric oxide is an oxide of a metal which shows both acidic and basic properties: it reacts with both acids and alkalis to form a salt and water.`],
        ['Neutral oxide', `A neutral oxide shows neither acidic nor basic properties.`]],
      idea: `Hydrogen is prepared in the laboratory by the action of a dilute acid on zinc. It is the lightest gas, and it burns with a "pop" sound when a lighted splint is applied.` }
  ],
  'c-nsc': [
    {}, {},
    { d: [['Allotropy', `Allotropy is the existence of an element in two or more different forms in the same physical state. The different forms are called allotropes.`]],
      idea: `Diamond and graphite are allotropes of carbon. Their properties differ because their atoms are bonded in different arrangements.`,
      r: [`In diamond each carbon atom is covalently bonded to four others in a giant tetrahedral network. Diamond is very hard and does not conduct electricity.`,
        `In graphite each carbon atom is bonded to three others in layers of hexagons, with delocalised electrons between the layers. Graphite is soft and slippery, and it conducts electricity.`,
        `Carbon dioxide is prepared from calcium carbonate and dilute hydrochloric acid, and it turns limewater milky. Carbon monoxide is poisonous because it combines with haemoglobin. It is used as a reducing agent.`] }
  ],
  'c-metal': [
    { d: [['Activity (reactivity) series', `The activity series is the arrangement of the metals in order of their reactivity, with the most reactive metal at the top.`],
        ['Ore', `An ore is a naturally occurring mineral from which a metal can be extracted profitably.`]],
      idea: `The more reactive a metal is, the more stable its compounds are and the more difficult it is to extract. A more reactive metal displaces a less reactive metal from its compounds.` },
    { d: [['Alloy', `An alloy is a uniform mixture of two or more metals, or of a metal with a non-metal such as carbon.`]] },
    { d: [['Rusting', `Rusting is the slow oxidation of iron in the presence of both air and water to form hydrated iron(III) oxide, Fe₂O₃·xH₂O.`]],
      idea: `Dissolved salts speed up rusting. Rusting is prevented by keeping air and water away from the iron, or by sacrificial protection.` }
  ],
  'c-env': [
    { d: [['Pollution', `Pollution is the release into the environment of substances, called pollutants, in quantities that are harmful to living things or to the environment.`]],
      idea: `The burning of fuels is the largest source of air pollution. Water is polluted by sewage, by oil spills and by fertilisers and other chemicals washed off the land.` }
  ],
  'c-qual': [
    {},
    { d: [['Precipitate', `A precipitate is an insoluble solid formed when two solutions are mixed.`]] }
  ],
  'c-hydro': [
    { d: [['Hydrocarbon', `A hydrocarbon is a compound which contains carbon and hydrogen only.`],
        ['Homologous series', `A homologous series is a family of organic compounds which have the same general formula and the same functional group, and in which each member differs from the next by a –CH₂– group. The members have similar chemical properties and show a gradual change in physical properties.`],
        ['Functional group', `A functional group is an atom or a group of atoms which determines the chemical properties of the compounds that contain it.`],
        ['Isomerism', `Isomerism is the existence of two or more compounds with the same molecular formula but different structural formulae. The compounds are called isomers.`]],
      idea: '',
      r: [`Alkanes: C<sub>n</sub>H<sub>2n+2</sub>, with single bonds only. Alkenes: C<sub>n</sub>H<sub>2n</sub>, with one C=C double bond. Alkynes: C<sub>n</sub>H<sub>2n−2</sub>, with one C≡C triple bond.`,
        `Prefixes for the number of carbon atoms: meth- 1, eth- 2, prop- 3, but- 4, pent- 5, hex- 6.`,
        `Butane and 2-methylpropane are isomers: both have the molecular formula C₄H₁₀.`] },
    { d: [['Saturated hydrocarbon', `A saturated hydrocarbon contains only single bonds between its carbon atoms.`],
        ['Unsaturated hydrocarbon', `An unsaturated hydrocarbon contains at least one double or triple bond between carbon atoms.`],
        ['Substitution reaction', `A substitution reaction is one in which an atom or group of atoms in a molecule is replaced by another atom or group of atoms.`],
        ['Addition reaction', `An addition reaction is one in which two or more molecules combine to form a single product. It takes place across a double or triple bond.`]],
      idea: `Alkanes are saturated and react by substitution. Alkenes are unsaturated and react by addition.` },
    { d: [['Petroleum (crude oil)', `Petroleum is a naturally occurring mixture of hydrocarbons.`],
        ['Cracking', `Cracking is the breaking down of large hydrocarbon molecules into smaller, more useful molecules by heat alone (thermal cracking) or by heat and a catalyst (catalytic cracking).`],
        ['Octane number', `The octane number of a petrol is a measure of how smoothly it burns without knocking. It is the percentage by volume of 2,2,4-trimethylpentane in a mixture with heptane which has the same knocking behaviour as the petrol.`]],
      idea: `Petroleum is separated into fractions by fractional distillation.` }
  ],
  'c-func': [
    { d: [['Alcohols (alkanols)', `Alcohols are a homologous series of organic compounds which contain the hydroxyl functional group, –OH. Their general formula is C<sub>n</sub>H<sub>2n+1</sub>OH.`],
        ['Fermentation', `Fermentation is the slow decomposition of sugars into ethanol and carbon dioxide by enzymes from yeast, in the absence of air.`]],
      idea: `Ethanol, C₂H₅OH, is manufactured by the fermentation of sugars or by the hydration of ethene with steam.` },
    { d: [['Carboxylic acids (alkanoic acids)', `Carboxylic acids are a homologous series of organic compounds which contain the carboxyl functional group, –COOH. Their general formula is C<sub>n</sub>H<sub>2n+1</sub>COOH.`],
        ['Esterification', `Esterification is the reversible reaction between a carboxylic acid and an alcohol, in the presence of concentrated sulphuric acid as a catalyst, to form an ester and water.`]],
      idea: `Carboxylic acids are weak acids. Esters have pleasant, fruity smells.` }
  ],
  'c-poly': [
    { d: [['Polymerisation', `Polymerisation is the process by which many small molecules, called monomers, join together to form a very large molecule, called a polymer, of high relative molecular mass.`],
        ['Addition polymerisation', `In addition polymerisation, unsaturated monomers add to one another to form the polymer as the only product.`],
        ['Condensation polymerisation', `In condensation polymerisation, monomers join together with the elimination of a small molecule, such as water or hydrogen chloride, at each link.`]],
      idea: `Plastics are synthetic polymers. Starch, proteins and natural rubber are natural polymers.`,
      r: [`Addition polymers: ethene gives poly(ethene), and chloroethene gives poly(chloroethene), PVC.`,
        `Condensation polymers: nylon, terylene, proteins and starch.`,
        `Thermoplastics soften on heating and can be remoulded. Thermosetting plastics set hard on heating and cannot be remoulded.`] },
    { d: [['Saponification', `Saponification is the alkaline hydrolysis of a fat or oil to form soap and glycerol (propane-1,2,3-triol).`],
        ['Soap', `Soap is the sodium or potassium salt of a long-chain fatty acid.`]],
      idea: `Fats and oils are esters of glycerol and long-chain fatty acids.` },
    { d: [['Carbohydrates', `Carbohydrates are naturally occurring compounds of carbon, hydrogen and oxygen with the general formula C<sub>x</sub>(H₂O)<sub>y</sub>.`],
        ['Proteins', `Proteins are natural polymers of amino acids joined by peptide links.`]],
      idea: `Starch is a natural polymer of glucose. Simple tests show which of these substances are present in a food.` }
  ],
  'c-nuc': [
    { d: [['Radioactivity', `Radioactivity is the spontaneous emission of radiation, as alpha particles, beta particles or gamma rays, from the nucleus of an unstable atom.`]],
      idea: '' },
    { d: [['Half-life', `The half-life of a radioactive element is the time taken for half of the atoms in a given sample of the element to decay.`]],
      idea: `In a nuclear equation, the sum of the mass numbers and the sum of the atomic numbers are the same on both sides.` },
    { d: [['Nuclear fission', `Nuclear fission is the splitting of a heavy nucleus into two lighter nuclei of roughly equal mass, with the release of neutrons and a large amount of energy.`],
        ['Nuclear fusion', `Nuclear fusion is the combination of two or more light nuclei to form a heavier nucleus, with the release of a large amount of energy.`]],
      idea: `Nuclear fusion is the source of the Sun's energy.`,
      r: [`In fission, a neutron strikes a uranium-235 nucleus, which splits and releases two or three more neutrons. These can split further nuclei, so a chain reaction follows.`,
        `Fusion takes place only at extremely high temperatures, such as those in the Sun.`,
        `Uses of radioisotopes: cobalt-60 in the treatment of cancer, carbon-14 in dating, tracers in industry and medicine, and uranium-235 in nuclear power stations.`] }
  ]
};

CHEM.topics.push(

/* ───────────── SEPARATION OF MIXTURES ───────────── */
{
  id: 'c-sep', name: 'Separation of Mixtures', sec: 'Section I · Matter and its particles',
  goals: ['Tell elements, compounds and mixtures apart', 'Choose the right method to separate a mixture', 'Read a chromatogram and work out R<sub>f</sub> values'],
  trap: `Pick the method from the property that differs. Insoluble solid in a liquid: filtration. Dissolved solid you want to keep: evaporation or crystallisation. Liquid you want to keep: distillation. Liquids with close boiling points: fractional distillation. Dyes: chromatography.`,
  parts: [
    {
      title: 'Elements, compounds and mixtures',
      idea: `An element has only one kind of atom. A compound is two or more elements chemically joined in a fixed ratio, and it has new properties. A mixture is substances mixed but not joined: each keeps its own properties, and the amounts can vary.`,
      rules: [
        `Compound: fixed composition, new properties, separated only by a chemical reaction.`,
        `Mixture: any composition, each part keeps its properties, separated by physical methods.`,
        `A pure substance melts and boils at one sharp temperature. Impurities lower the melting point and raise the boiling point.`
      ],
      ex: {
        q: `Iron filings are mixed with sulphur. Some of the mixture is heated until it glows. Which is the mixture and which is the compound?`,
        steps: [
          [`Before heating: a magnet pulls the iron out`, `Each substance keeps its own properties, so this is a mixture.`],
          [`After heating: a black solid, iron(II) sulphide, forms`, `Fe + S ${RA} FeS. The iron and sulphur are now chemically joined.`],
          [`A magnet no longer pulls out the iron`, `The new substance has new properties: it is a compound.`]
        ],
        why: [2, 'Why does the magnet stop working after heating?', ['The iron is now chemically joined in a new substance with new properties', 'Heat destroys magnetism for ever', 'The sulphur covers the iron'], ['Right. FeS is a compound, and it is not magnetic like iron.', 'Iron that is heated and cooled on its own is still pulled by a magnet.', 'Covering would not stop a magnet. The iron has reacted.']]
      },
      tryit: {
        q: `Which observation shows that a sample of water is pure?`,
        ask: `Choose the best evidence.`, o: ['It boils at exactly 100 °C at 1 atm', 'It is colourless', 'It has no smell', 'It is clear'], a: 0,
        h: `Purity is tested with a fixed point: a melting point or a boiling point.`,
        e: `Pure water boils at 100 °C at one atmosphere. Dissolved impurities raise the boiling point.`,
        fb: ['', 'Salt water is also colourless. Colour does not prove purity.', 'Many solutions have no smell. Smell does not prove purity.', 'A clear liquid can still have substances dissolved in it.']
      }
    },
    {
      title: 'Filtration, evaporation, crystallisation and distillation',
      idea: `Choose a method from the property that differs between the parts. Size of particles: filtration. A dissolved solid you want to keep: evaporation or crystallisation. The liquid you want to keep: distillation.`,
      g: ['app', { kind: 'filter', label: 'Filtration: a funnel with filter paper over a beaker' }], cap: `The solid that stays on the paper is the residue. The liquid that passes through is the filtrate.`,
      rules: [
        `Filtration separates an insoluble solid from a liquid.`,
        `Crystallisation: heat the solution until it is saturated, then let it cool. Do not evaporate to dryness if the crystals contain water of crystallisation.`,
        `Simple distillation gets a pure liquid back from a solution: the liquid boils off and condenses.`
      ],
      ex: {
        q: `Describe how to get pure, dry salt from a mixture of salt and sand.`,
        steps: [
          [`Add water and stir`, `The salt dissolves. The sand does not.`],
          [`Filter`, `The sand stays on the filter paper. The salt solution passes through as the filtrate.`],
          [`Evaporate the filtrate`, `The water leaves and the salt is left behind.`]
        ],
        why: [0, 'Why add water first?', ['Salt is soluble in water but sand is not, so they can then be filtered apart', 'Water makes the sand lighter', 'Water reacts with the sand'], ['Yes. The difference in solubility is what the method uses.', 'Sand does not change. It simply does not dissolve.', 'No reaction happens. It is a physical separation.']]
      },
      tryit: {
        q: `How can pure water be obtained from sea water?`,
        ask: `Choose the method.`, o: ['Simple distillation', 'Filtration', 'Evaporation', 'Chromatography'], a: 0,
        h: `Which method collects the liquid, not the solid?`,
        e: `In distillation the water boils off, is cooled in the condenser and is collected. The salt stays in the flask.`,
        fb: ['', 'Salt is dissolved, so it passes straight through filter paper.', 'Evaporation keeps the salt and loses the water into the air.', 'Chromatography separates dyes. It does not give you a beaker of pure water.']
      }
    },
    {
      title: 'Fractional distillation and chromatography',
      idea: `Fractional distillation separates liquids that mix, such as ethanol and water, because they boil at different temperatures. Chromatography separates dyes because they move up the paper at different speeds.`,
      g: ['app', { kind: 'chrom' }], cap: `The mixture gives two spots, level with the spots of A and B. So the mixture contains A and B.`,
      rules: [
        `Liquids that mix but boil at different temperatures: fractional distillation. Liquids that do not mix, such as oil and water: a separating funnel.`,
        `R<sub>f</sub> = distance moved by the spot ÷ distance moved by the solvent. It is always less than 1.`,
        `Sublimation separates a solid that changes straight to a gas, such as iodine or ammonium chloride, from one that does not.`
      ],
      ex: {
        q: `A spot moves 4.2 cm while the solvent front moves 6.0 cm. Find its R<sub>f</sub> value.`,
        steps: [
          [`R<sub>f</sub> = distance moved by spot ÷ distance moved by solvent`, `Both are measured from the start line.`],
          [`R<sub>f</sub> = 4.2 ÷ 6.0`, `The spot is on top, the solvent below.`],
          [`R<sub>f</sub> = 0.70`, `It is less than 1, as it must be.`]
        ],
        why: [1, 'Why is the spot distance on top?', ['The spot never travels further than the solvent, so R<sub>f</sub> must be less than 1', 'The bigger number always goes on top', 'It does not matter which way round'], ['Exactly.', 'It is the other way: the smaller distance, the spot, goes on top.', 'Upside down you get 1.43, which is impossible for an R<sub>f</sub> value.']]
      },
      tryit: {
        q: `Ethanol boils at 78 °C and water at 100 °C. Which method separates a mixture of the two?`,
        ask: `Choose the method.`, o: ['Fractional distillation', 'Separating funnel', 'Filtration', 'Sublimation'], a: 0,
        h: `Ethanol and water mix completely. What is different about them?`,
        e: `They mix, so a funnel cannot separate them. Their boiling points differ, so fractional distillation does.`,
        fb: ['', 'A separating funnel is for liquids that do not mix, like oil and water.', 'Both are liquids. Neither is caught by filter paper.', 'Sublimation is for solids that turn straight into gas.']
      }
    }
  ],
  spot: { part: 1, who: 'Tunde', q: `Describe how to obtain pure, dry crystals of copper(II) sulphate from its solution.`, lines: ['Heat the solution to concentrate it', 'Keep heating until all the water has evaporated', 'Collect the solid that is left'], bad: 1,
    okfb: ['Concentrating the solution first is right.', 'Collecting the solid is right, once the crystals have formed properly.'],
    o: ['Heating to dryness drives off the water of crystallisation. Stop when the solution is saturated and let it cool', 'He should filter before heating', 'Copper(II) sulphate cannot form crystals', 'Nothing is wrong'],
    fb: ['That is it. The blue crystals need their water of crystallisation.', 'The solution has nothing to filter out.', 'It forms blue crystals, CuSO₄·5H₂O.', 'Heating to dryness leaves a white powder, not blue crystals.'],
    h: ['Blue copper(II) sulphate crystals contain water. What happens to that water if you heat to dryness?'], fix: 'Heat until a drop on a cold rod forms crystals, then let it cool. Filter off the crystals and dry them between filter papers.' },
  qs: [
    { l: 1, q: `Which of these is a mixture?`, o: ['Air', 'Sodium chloride', 'Distilled water', 'Carbon dioxide'], a: 0, e: `Air is a mixture of nitrogen, oxygen, argon, carbon dioxide and water vapour, and its make-up varies.`, w: ['', 'Sodium chloride is a compound: sodium and chlorine joined in a fixed ratio.', 'Distilled water is a pure compound.', 'Carbon dioxide is a compound with a fixed formula, CO₂.'] },
    { l: 1, q: `Which method separates sand from water?`, o: ['Filtration', 'Distillation', 'Chromatography', 'Sublimation'], a: 0, e: `Sand is insoluble, so filter paper holds it back while the water passes through.`, w: ['', 'Distillation would work but is slow and wasteful. Filtration is the method for an insoluble solid.', 'Chromatography separates dissolved dyes.', 'Neither sand nor water sublimes.'] },
    { l: 2, dx: 1, q: `Which pair can be separated with a separating funnel?`, o: ['Kerosene and water', 'Ethanol and water', 'Salt and water', 'Sand and water'], a: 0, e: `Kerosene and water do not mix. They form two layers, and the lower layer is run off through the tap.`, w: ['', 'Ethanol and water mix completely, so there are no layers. Use fractional distillation.', 'Salt dissolves in water. There are no layers.', 'Sand is a solid. Use filtration.'] },
    { l: 2, q: `Which of these sublimes on heating?`, o: ['Iodine', 'Sodium chloride', 'Sand', 'Copper(II) sulphate'], a: 0, e: `Iodine changes straight from solid to purple vapour, then back to solid on a cold surface. Ammonium chloride and naphthalene also sublime.`, w: ['', 'Sodium chloride melts at 801 °C. It does not sublime.', 'Sand does not sublime.', 'It loses its water of crystallisation and turns white. It does not sublime.'] },
    { l: 2, q: `Which property shows that a substance is a compound and not a mixture?`, o: ['It has a fixed composition by mass', 'It can be separated by filtration', 'Its parts keep their own properties', 'It boils over a range of temperatures'], a: 0, e: `A compound always contains its elements in the same ratio by mass. Water is always 1 g of hydrogen to 8 g of oxygen.`, w: ['', 'Filtration separates mixtures, not compounds.', 'That describes a mixture.', 'Boiling over a range shows a mixture or an impure substance.'] },
    { l: 3, q: `A chromatogram shows a spot 3.0 cm from the start line. The solvent front is 7.5 cm from the start line. What is the R<sub>f</sub> value?`, o: ['0.40', '2.50', '0.30', '4.50'], a: 0, e: `R<sub>f</sub> = 3.0 ÷ 7.5 = 0.40.`, w: ['', 'You divided the wrong way round. R<sub>f</sub> is always less than 1.', 'Divide by 7.5, not 10.', 'That is the difference, 7.5 − 3.0. R<sub>f</sub> is a ratio.'] },
    { l: 3, q: `In the chromatogram, which dyes does the mixture contain?`, g: ['app', { kind: 'chrom', label: 'Chromatogram: the mixture gives spots level with dyes A and B. Dye C is halfway up.' }], o: ['A and B', 'A, B and C', 'C only', 'B and C'], a: 0, e: `The mixture gives two spots. One is level with A's spot and the other is level with B's. Nothing in the mixture is level with C.`, w: ['', 'No spot of the mixture is level with C.', 'C\'s spot is halfway up. The mixture has no spot there.', 'The lower spot of the mixture matches A, not C.'] },
    { l: 3, q: `Crude oil is separated into petrol, kerosene, diesel and other fractions by`, o: ['fractional distillation', 'filtration', 'crystallisation', 'chromatography'], a: 0, e: `The fractions have different boiling ranges, so they condense at different heights in the fractionating column.`, w: ['', 'The fractions are all liquids that mix. Filtration cannot separate them.', 'Crystallisation gets a solid from a solution.', 'Chromatography separates tiny amounts of dyes, not tonnes of oil.'] },
    { l: 4, q: `Why are crystals of copper(II) sulphate not obtained by heating its solution to dryness?`, o: ['The water of crystallisation would be driven off', 'The crystals would melt', 'The copper would be oxidised', 'The solution would boil over'], a: 0, e: `Blue CuSO₄·5H₂O contains water in its crystals. Heating to dryness drives it off and leaves white anhydrous CuSO₄.`, w: ['', 'The problem is losing water, not melting.', 'No oxidation happens. It is a physical change.', 'That is a safety point, not the reason the crystals are spoilt.'] },
    { l: 4, q: `A sample of a solid melts between 112 °C and 118 °C. The pure substance melts at 122 °C. What does this show?`, o: ['The sample is impure', 'The sample is pure', 'The sample is a compound', 'The thermometer is faulty'], a: 0, e: `Impurities lower the melting point and make it melt over a range instead of at one sharp temperature.`, w: ['', 'A pure substance melts sharply at its own melting point.', 'Melting over a range shows impurity. It says nothing about compound or element.', 'Melting low and over a range is exactly what impurities do.'] },
    { l: 5, q: `A mixture contains salt, sand and iodine. In which order should the steps be done to separate all three?`, o: ['Heat to sublime the iodine, add water, filter, evaporate the filtrate', 'Add water, filter, evaporate, then sublime', 'Filter, heat, add water, evaporate', 'Add water, evaporate, filter, sublime'], a: 0, e: `Remove the iodine first by sublimation, while everything is dry. Then dissolve the salt, filter off the sand and evaporate the filtrate to get the salt.`, w: ['', 'Iodine dissolves a little in water and would be lost with the salt. Sublime it first.', 'You cannot filter a dry mixture.', 'Evaporating before filtering leaves the sand mixed with the salt.'] },
    { l: 5, q: `Which pair of liquids would be hardest to separate by simple distillation?`, o: ['Two liquids that boil at 78 °C and 82 °C', 'Water and salt solution', 'Two liquids that boil at 60 °C and 140 °C', 'Ink and water'], a: 0, e: `When the boiling points are close, both vapours come over together. Fractional distillation is needed.`, w: ['', 'The salt does not boil at all, so simple distillation works well.', 'An 80 °C gap is easy to separate.', 'The dyes in ink do not boil off with the water, so simple distillation works.'] }
  ]
},

/* ───────────── KINETIC THEORY AND THE GAS LAWS ───────────── */
{
  id: 'c-kin', name: 'Kinetic Theory and Gas Laws', sec: 'Section I · Matter and its particles',
  goals: ['Explain the states of matter and diffusion with particles', 'Use Boyle\'s, Charles\' and the general gas law, with temperature in kelvin', 'Use Graham\'s law to compare rates of diffusion'],
  trap: `Always change °C to kelvin before using a gas law: add 273. Using °C is the most common way marks are lost.`,
  parts: [
    {
      title: 'Particles in solids, liquids and gases',
      idea: `All matter is made of particles that are always moving. Heating gives them more energy. In a solid they only vibrate. In a liquid they slide past each other. In a gas they move fast and far apart.`,
      g: ['states', {}], cap: `The further the particles are apart, the weaker the forces between them.`,
      rules: [
        `Gas pressure comes from particles hitting the walls of the container.`,
        `Diffusion is the spreading of particles from where they are crowded to where there are fewer. It is fastest in gases.`,
        `At the same temperature, lighter particles move faster and diffuse faster.`
      ],
      ex: {
        q: `Cotton wool soaked in ammonia is put at one end of a long tube, and cotton wool soaked in hydrogen chloride at the other. A white ring of ammonium chloride forms nearer the hydrogen chloride end. Explain why.`,
        steps: [
          [`NH₃ has M<sub>r</sub> = 17. HCl has M<sub>r</sub> = 36.5`, `Ammonia particles are lighter.`],
          [`Lighter particles diffuse faster`, `So ammonia travels further down the tube in the same time.`],
          [`The gases meet nearer the HCl end`, `NH₃ + HCl ${RA} NH₄Cl, the white ring.`]
        ],
        why: [1, 'Why do lighter particles diffuse faster?', ['At the same temperature all particles have the same average kinetic energy, so lighter ones move faster', 'Lighter particles are pulled less by gravity', 'Lighter gases are more reactive'], ['Right. Kinetic energy = ½mv², so a smaller m means a bigger v.', 'Gravity has almost no effect over a tube this size.', 'Reactivity has nothing to do with how fast particles travel.']]
      },
      tryit: {
        q: `At the same temperature, which gas diffuses fastest?`,
        ask: `Choose the gas.`, o: [ch('H2'), ch('O2'), ch('CO2'), ch('Cl2')], a: 0,
        h: `Find the gas with the smallest relative molecular mass.`,
        e: `H₂ has M<sub>r</sub> = 2, the smallest of the four, so it diffuses fastest.`,
        fb: ['', 'O₂ has M<sub>r</sub> = 32, heavier than H₂.', 'CO₂ has M<sub>r</sub> = 44.', 'Cl₂ has M<sub>r</sub> = 71, the heaviest here, so it is the slowest.']
      }
    },
    {
      title: 'Boyle\'s law, Charles\' law and the general gas law',
      idea: `Squeeze a gas and its pressure rises. Heat it and it expands. The gas laws put numbers on this, as long as temperature is measured in kelvin, where 0 K is the lowest temperature possible.`,
      g: ['cplot', { xmax: 10, ymax: 10, xl: 'Volume', yl: 'Pressure', curves: [{ pts: [[1, 9], [1.5, 6], [2, 4.5], [3, 3], [4.5, 2], [6, 1.5], [9, 1]] }], label: 'Boyle\'s law: pressure falls as volume rises, in a curve' }], cap: `Boyle's law: double the pressure and the volume halves, at constant temperature.`,
      rules: [
        `Boyle's law (constant temperature): P₁V₁ = P₂V₂.`,
        `Charles' law (constant pressure): ${fr('V₁', 'T₁')} = ${fr('V₂', 'T₂')}, with T in kelvin.`,
        `General gas law: ${fr('P₁V₁', 'T₁')} = ${fr('P₂V₂', 'T₂')}. Kelvin = °C + 273.`
      ],
      ex: {
        q: `A gas occupies 200 cm³ at 27 °C. Find its volume at 127 °C, at constant pressure.`,
        steps: [
          [`T₁ = 27 + 273 = 300 K, T₂ = 127 + 273 = 400 K`, `Change to kelvin first.`],
          [`V₂ = V₁ × ${fr('T₂', 'T₁')} = 200 × ${fr(400, 300)}`, `Charles' law, rearranged.`],
          [`V₂ = 267 cm³`, `It got hotter, so it got bigger. That makes sense.`]
        ],
        why: [0, 'Why change to kelvin?', ['Volume is proportional to the kelvin temperature, not the Celsius one', 'Kelvin numbers are bigger, so the answer is more accurate', 'Gas laws only work above 273 °C'], ['Right. At 0 °C a gas still has volume. At 0 K it would have none.', 'Accuracy is not the point. Using °C gives a wrong answer.', 'Gas laws work at any temperature, as long as it is in kelvin.']]
      },
      tryit: {
        q: `A gas occupies 300 cm³ at 1 atm. It is compressed to 2 atm at constant temperature. Find its new volume.`,
        given: [`Boyle's law: P₁V₁ = P₂V₂`, `1 × 300 = 2 × V₂`],
        ask: `So V₂ is ?`, o: ['150 cm³', '600 cm³', '300 cm³', '100 cm³'], a: 0,
        h: `Divide 300 by 2.`, e: `V₂ = 300 ÷ 2 = 150 cm³. Doubling the pressure halves the volume.`,
        fb: ['', 'Higher pressure squeezes the gas, so the volume goes down, not up.', 'The pressure changed, so the volume must change too.', 'Divide by 2, not by 3.']
      }
    },
    {
      title: 'Graham\'s law of diffusion',
      idea: `Graham's law puts a number on "lighter gases diffuse faster": the rate of diffusion is inversely proportional to the square root of the relative molecular mass, or of the density.`,
      rules: [
        `${fr('rate of A', 'rate of B')} = √(${fr('M<sub>B</sub>', 'M<sub>A</sub>')})`,
        `Time taken is the opposite of rate: ${fr('t<sub>A</sub>', 't<sub>B</sub>')} = √(${fr('M<sub>A</sub>', 'M<sub>B</sub>')})`,
        `Density works in place of M<sub>r</sub>, because at the same temperature and pressure they are proportional.`
      ],
      ex: {
        q: `How many times faster does hydrogen diffuse than oxygen?`,
        steps: [
          [`M(H₂) = 2, M(O₂) = 32`, `Relative molecular masses.`],
          [`${fr('rate H₂', 'rate O₂')} = √(${fr(32, 2)}) = √16`, `The heavier gas's mass goes on top.`],
          [`= 4`, `Hydrogen diffuses 4 times as fast as oxygen.`]
        ],
        why: [1, 'Why does 32 go on top?', ['The rate is inversely proportional to √M, so the other gas\'s mass goes on top', 'The bigger number always goes on top', 'Because oxygen is written second'], ['Right. Lighter gas, faster rate.', 'It only looks like that here. The rule is the inverse.', 'The order of writing does not decide it. The inverse rule does.']]
      },
      tryit: {
        q: `A gas X diffuses 4 times as fast as oxygen. Find the relative molecular mass of X.`,
        given: [`4 = √(${fr(32, 'M')})`, `Square both sides: 16 = ${fr(32, 'M')}`],
        ask: `So M is ?`, o: ['2', '8', '128', '16'], a: 0,
        h: `M = 32 ÷ 16.`, e: `M = 32 ÷ 16 = 2. The gas is hydrogen.`,
        fb: ['', 'You divided 32 by 4 without squaring. Square both sides first.', 'A faster gas must be lighter than oxygen, not heavier.', '16 is the square of the rate ratio. Now divide 32 by it.']
      }
    }
  ],
  spot: { part: 1, who: 'Amaka', q: `A gas occupies 100 cm³ at 20 °C. Find its volume at 40 °C, at constant pressure.`, lines: [`${fr('V₁', 'T₁')} = ${fr('V₂', 'T₂')}`, 'V₂ = 100 × 40 ÷ 20', 'V₂ = 200 cm³'], bad: 1,
    okfb: ['Charles\' law is the right law at constant pressure.', 'The arithmetic follows from line 2.'],
    o: ['She used °C. Change to kelvin: 293 K and 313 K', 'She should use Boyle\'s law', 'She should multiply by 20 and divide by 40', 'Nothing is wrong'],
    fb: ['That is it.', 'Boyle\'s law is for constant temperature. Here the temperature changes.', 'Hotter gas is bigger, so the bigger temperature goes on top.', 'Warming a gas from 20 °C to 40 °C does not double its volume.'],
    h: ['Would a gas really double in volume when warmed from 20 °C to 40 °C?'], fix: 'V₂ = 100 × 313 ÷ 293 = 107 cm³.' },
  qs: [
    { l: 1, q: `In which state are the particles furthest apart?`, o: ['Gas', 'Liquid', 'Solid', 'They are the same in all three'], a: 0, e: `Gas particles are far apart and move fast in all directions.`, w: ['', 'Liquid particles are close together, though they can slide past each other.', 'Solid particles are packed closely in fixed positions.', 'The spacing is very different, which is why gases can be compressed.'] },
    { l: 1, q: `Absolute zero is`, o: ['0 K, or −273 °C', '0 °C', '273 K', '−100 °C'], a: 0, e: `At 0 K, which is −273 °C, the particles would have the least possible energy.`, w: ['', '0 °C is the freezing point of water, which is 273 K.', '273 K is 0 °C.', 'Absolute zero is −273 °C.'] },
    { l: 2, dx: 1, q: `Convert 47 °C to kelvin.`, o: ['320 K', '226 K', '47 K', '273 K'], a: 0, e: `K = °C + 273 = 47 + 273 = 320 K.`, w: ['', 'You took 47 away from 273. Add it.', 'Kelvin and Celsius degrees are the same size, but the zero is different. Add 273.', '273 K is 0 °C.'] },
    { l: 2, q: `What causes the pressure of a gas in a container?`, o: ['Particles hitting the walls', 'Particles attracting each other', 'The weight of the particles', 'Particles vibrating in fixed positions'], a: 0, e: `Each collision with the wall pushes on it. More or harder collisions mean higher pressure.`, w: ['', 'Attraction between gas particles is very weak and lowers pressure slightly.', 'The weight of a gas is far too small to explain its pressure.', 'That describes a solid.'] },
    { l: 3, q: `A gas has a volume of 50 cm³ at 2 atm. What is its volume at 0.5 atm, at the same temperature?`, o: ['200 cm³', '12.5 cm³', '25 cm³', '100 cm³'], a: 0, e: `P₁V₁ = P₂V₂: 2 × 50 = 0.5 × V₂, so V₂ = 100 ÷ 0.5 = 200 cm³.`, w: ['', 'Lower pressure lets the gas expand. The volume should go up.', 'The pressure fell to a quarter, so the volume goes up four times.', '100 is P₁V₁. Divide it by 0.5.'] },
    { l: 3, q: `A gas occupies 400 cm³ at 127 °C. At what temperature will it occupy 300 cm³, at constant pressure?`, o: ['27 °C', '95 °C', '300 °C', '−3 °C'], a: 0, e: `T₁ = 400 K. T₂ = T₁ × V₂ ÷ V₁ = 400 × 300 ÷ 400 = 300 K, which is 27 °C.`, w: ['', 'You used 127 °C directly instead of 400 K.', '300 is the answer in kelvin. Change it back to °C.', 'Check your conversion: 300 K − 273 = 27 °C.'] },
    { l: 3, q: `The white ring in the ammonia and hydrogen chloride tube forms nearer the HCl end because`, o: ['ammonia molecules are lighter and diffuse faster', 'hydrogen chloride is denser and diffuses faster', 'the tube is warmer at the ammonia end', 'ammonia is more reactive'], a: 0, e: `NH₃ (M<sub>r</sub> 17) is lighter than HCl (M<sub>r</sub> 36.5), so it travels further before they meet.`, w: ['', 'Denser gases diffuse more slowly, not faster.', 'Both ends are at room temperature.', 'Reactivity does not change how fast the particles travel.'] },
    { l: 4, q: `Under the same conditions, how much faster does methane (CH₄) diffuse than sulphur dioxide (SO₂)?`, o: ['2 times', '4 times', '½ times', '√2 times'], a: 0, e: `Rate CH₄ ÷ rate SO₂ = √(64 ÷ 16) = √4 = 2.`, w: ['', '4 is the mass ratio. Take its square root.', 'Methane is lighter, so it is faster, not slower.', 'The mass ratio is 4, and √4 = 2.'] },
    { l: 4, q: `A gas at 27 °C and 1 atm occupies 600 cm³. Find its volume at 77 °C and 2 atm.`, o: ['350 cm³', '1400 cm³', '300 cm³', '855 cm³'], a: 0, e: `V₂ = V₁ × ${fr('P₁', 'P₂')} × ${fr('T₂', 'T₁')} = 600 × ${fr(1, 2)} × ${fr(350, 300)} = 350 cm³.`, w: ['', 'You multiplied by 2 for the pressure. Higher pressure makes the volume smaller.', 'That allows for the pressure only. Now allow for the rise in temperature.', 'You used °C (77 ÷ 27). Use kelvin.'] },
    { l: 4, q: `Equal volumes of oxygen and gas Y take 20 s and 40 s to diffuse through a small hole. Find the relative molecular mass of Y.`, o: ['128', '64', '8', '16'], a: 0, e: `t<sub>Y</sub> ÷ t<sub>O₂</sub> = √(M<sub>Y</sub> ÷ 32). 40 ÷ 20 = 2, so M<sub>Y</sub> ÷ 32 = 4 and M<sub>Y</sub> = 128.`, w: ['', 'You did not square the ratio of the times.', 'Y takes longer, so it is heavier than oxygen, not lighter.', 'Square 2 to get 4, then multiply by 32.'] },
    { l: 5, q: `Which graph shape shows Charles' law, plotting volume against temperature in kelvin?`, o: ['A straight line through the origin', 'A curve falling as temperature rises', 'A horizontal line', 'A straight line that cuts the volume axis above zero'], a: 0, e: `V is proportional to T in kelvin, so the graph is a straight line through (0, 0).`, w: ['', 'That shape is Boyle\'s law, pressure against volume.', 'A horizontal line would mean temperature has no effect.', 'That is what you get against temperature in °C. In kelvin the line goes through the origin.'] },
    { l: 5, q: `Why must temperatures be in kelvin in the gas laws?`, o: ['Volume and pressure are proportional to the absolute temperature', 'Kelvin is the only unit in the syllabus', 'Gases freeze at 0 °C', 'It makes the numbers easier'], a: 0, e: `Proportion needs a true zero. 0 K is where a gas would have no volume and no pressure. 0 °C is not.`, w: ['', 'Both scales are used in chemistry. The gas laws need kelvin for a reason.', 'Most gases are still gases far below 0 °C.', 'The numbers are often bigger in kelvin. The reason is proportion.'] }
  ]
},

/* ───────────── ATOMIC STRUCTURE ───────────── */
{
  id: 'c-atom', name: 'Atomic Structure', sec: 'Section I · Matter and its particles',
  goals: ['Find the protons, neutrons and electrons in an atom or ion', 'Work out relative atomic mass from isotopes', 'Write electron configurations, in shells and in s, p and d orbitals'],
  trap: `Mass number = protons + neutrons. Electrons equal protons only in a neutral atom: a 2+ ion has 2 fewer electrons, a 2− ion has 2 more.`,
  parts: [
    {
      title: 'Protons, neutrons, electrons and isotopes',
      idea: `An atom has a tiny nucleus of protons and neutrons, with electrons around it in shells. The atomic number, Z, is the number of protons. It decides which element it is.`,
      g: ['atom', { sym: 'Na', p: 11, n: 12, shells: [2, 8, 1], label: 'Sodium atom: 11 protons and 12 neutrons in the nucleus, electrons 2, 8, 1 in shells' }], cap: `Sodium, ²³₁₁Na: 11 protons, 12 neutrons, and 11 electrons arranged 2, 8, 1.`,
      rules: [
        `Proton: charge +1, mass 1. Neutron: charge 0, mass 1. Electron: charge −1, mass about 1/1840.`,
        `Mass number A = protons + neutrons. Neutrons = A − Z.`,
        `Isotopes are atoms of the same element with different numbers of neutrons. They react the same way.`
      ],
      ex: {
        q: `Find the numbers of protons, neutrons and electrons in ²⁷₁₃Al³⁺.`,
        steps: [
          [`Protons = Z = 13`, `The bottom number.`],
          [`Neutrons = 27 − 13 = 14`, `Mass number minus atomic number.`],
          [`Electrons = 13 − 3 = 10`, `A 3+ ion has lost 3 electrons.`]
        ],
        why: [2, 'Why take away 3?', ['Positive ions form when atoms lose electrons', 'Because aluminium is in group III', 'Positive ions gain electrons'], ['Right. Losing 3 negative electrons leaves a charge of 3+.', 'The group explains why it loses 3, but the charge tells you how many.', 'Gaining negative electrons would make it negative.']]
      },
      tryit: {
        q: `How many electrons are in a magnesium ion, Mg²⁺? (Z = 12)`,
        ask: `Choose the number.`, o: ['10', '12', '14', '2'], a: 0,
        h: `A 2+ ion has lost 2 electrons.`, e: `12 − 2 = 10 electrons, the same as a neon atom.`,
        fb: ['', '12 is the number in a neutral Mg atom.', 'Positive ions lose electrons, they do not gain them.', '2 is the number lost, not the number left.']
      }
    },
    {
      title: 'Relative atomic mass from isotopes',
      idea: `Most elements are a mix of isotopes. The relative atomic mass is the average mass of their atoms, weighted by how common each isotope is, compared with 1/12 of a carbon-12 atom.`,
      rules: [
        `A<sub>r</sub> = (mass₁ × %₁ + mass₂ × %₂) ÷ 100.`,
        `The answer must lie between the isotope masses, closer to the more common one.`,
        `This is why chlorine's A<sub>r</sub> is 35.5, not a whole number.`
      ],
      ex: {
        q: `Chlorine is 75% chlorine-35 and 25% chlorine-37. Find its relative atomic mass.`,
        steps: [
          [`(35 × 75) + (37 × 25)`, `Each mass times its percentage.`],
          [`= 2625 + 925 = 3550`, `Add them.`],
          [`A<sub>r</sub> = 3550 ÷ 100 = 35.5`, `Closer to 35, because chlorine-35 is more common.`]
        ],
        why: [0, 'Why not just average 35 and 37?', ['There is three times as much chlorine-35, so it counts three times as much', 'Because 37 is a heavier isotope', 'You can, it gives the same answer'], ['Right. A plain average would give 36, which is wrong.', 'Heaviness is not the point. How common each isotope is decides the weighting.', 'The plain average is 36, but the true A<sub>r</sub> is 35.5.']]
      },
      tryit: {
        q: `Boron is 20% boron-10 and 80% boron-11. Find its relative atomic mass.`,
        given: [`(10 × 20) + (11 × 80) = 200 + 880 = 1080`],
        ask: `So A<sub>r</sub> is ?`, o: ['10.8', '10.5', '10.2', '108'], a: 0,
        h: `Divide 1080 by 100.`, e: `1080 ÷ 100 = 10.8, closer to 11 because boron-11 is more common.`,
        fb: ['', '10.5 is the plain average. Weight by the percentages.', 'That is closer to 10, but boron-10 is the rarer isotope.', 'Divide by 100 because the percentages add up to 100.']
      }
    },
    {
      title: 'Electron configuration',
      idea: `Electrons fill shells from the inside out: 2 in the first, then 8, then 8 for the first 20 elements. Inside each shell there are sub-levels, s, p and d, filled in order of energy.`,
      g: ['atom', { sym: 'K', shells: [2, 8, 8, 1], label: 'Potassium atom with electrons 2, 8, 8, 1' }], cap: `Potassium, Z = 19: 2, 8, 8, 1, or 1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹.`,
      rules: [
        `An s sub-level holds 2 electrons, p holds 6, d holds 10.`,
        `Filling order: 1s 2s 2p 3s 3p 4s 3d 4p. Note that 4s fills before 3d.`,
        `The electrons in the outer shell decide how an element reacts.`
      ],
      ex: {
        q: `Write the electron configuration of calcium, Z = 20.`,
        steps: [
          [`Shells: 2, 8, 8, 2`, `20 electrons, filled from the inside out.`],
          [`1s² 2s² 2p⁶ 3s² 3p⁶`, `That is 18 electrons so far.`],
          [`then 4s²: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s²`, `4s fills before 3d.`]
        ],
        why: [2, 'Why 4s and not 3d?', ['The 4s sub-level has lower energy than 3d, so it fills first', '4 is bigger than 3', 'Calcium has no d electrons ever'], ['Right. Electrons go into the lowest energy level available.', 'The order is by energy, not by the shell number alone.', 'The 3d sub-level fills from scandium, Z = 21, onwards.']]
      },
      tryit: {
        q: `What is the electron configuration of sulphur, Z = 16?`,
        ask: `Choose the configuration.`, o: ['1s² 2s² 2p⁶ 3s² 3p⁴', '1s² 2s² 2p⁶ 3s² 3p⁶', '1s² 2s² 2p⁸ 3s² 3p²', '1s² 2s² 2p⁶ 3s⁶'], a: 0,
        h: `Add up the electrons as you go: 2, 4, 10, 12, then 4 more.`, e: `2 + 2 + 6 + 2 + 4 = 16. In shells that is 2, 8, 6.`,
        fb: ['', 'That has 18 electrons: argon.', 'A p sub-level holds at most 6 electrons.', 'An s sub-level holds at most 2 electrons.']
      }
    }
  ],
  spot: { part: 1, who: 'Chidi', q: `Copper is 70% copper-63 and 30% copper-65. Find its relative atomic mass.`, lines: ['The isotopes are 63 and 65', 'A<sub>r</sub> = (63 + 65) ÷ 2', 'A<sub>r</sub> = 64'], bad: 1,
    okfb: ['The isotope masses are right.', 'The arithmetic follows, but from the wrong method.'],
    o: ['He ignored how common each isotope is. Weight by the percentages', 'He should add the masses without dividing', 'The isotopes should be 29 and 29', 'Nothing is wrong'],
    fb: ['That is it.', 'Adding gives 128, far too big for one atom.', '29 is copper\'s atomic number, not a mass number.', 'Copper-63 is more than twice as common, so the answer must be nearer 63.'],
    h: ['Which isotope is more common? Should the answer be nearer 63 or 65?'], fix: 'A<sub>r</sub> = (63 × 70 + 65 × 30) ÷ 100 = 63.6.' },
  qs: [
    { l: 1, q: `Which particle has no charge?`, o: ['Neutron', 'Proton', 'Electron', 'Ion'], a: 0, e: `The neutron is neutral. Protons are positive and electrons are negative.`, w: ['', 'The proton has a charge of +1.', 'The electron has a charge of −1.', 'An ion is a charged atom or group of atoms.'] },
    { l: 1, q: `The atomic number of an element is the number of`, o: ['protons in its nucleus', 'neutrons in its nucleus', 'protons and neutrons', 'electrons in its outer shell'], a: 0, e: `The atomic number, Z, counts protons. Every atom of an element has the same number of protons.`, w: ['', 'Atoms of one element can have different numbers of neutrons.', 'That is the mass number.', 'Outer electrons decide the group, not the atomic number.'] },
    { l: 2, dx: 1, q: `How many neutrons are in an atom of ³⁷₁₇Cl?`, o: ['20', '17', '37', '54'], a: 0, e: `Neutrons = mass number − atomic number = 37 − 17 = 20.`, w: ['', '17 is the number of protons.', '37 is the mass number, protons plus neutrons.', 'Subtract, do not add.'] },
    { l: 2, q: `Isotopes of an element have the same number of`, o: ['protons', 'neutrons', 'nucleons', 'mass number'], a: 0, e: `Isotopes are the same element, so they have the same number of protons, but different numbers of neutrons.`, w: ['', 'Isotopes differ in their numbers of neutrons.', 'Nucleons are protons plus neutrons, which differ.', 'Different neutron numbers give different mass numbers.'] },
    { l: 2, q: `Which ion has the same number of electrons as a neon atom (Z = 10)?`, o: ['Na⁺', 'K⁺', 'Cl⁻', 'Li⁺'], a: 0, e: `Na has 11 electrons. Na⁺ has lost one, leaving 10, like neon.`, w: ['', 'K⁺ has 19 − 1 = 18 electrons, like argon.', 'Cl⁻ has 17 + 1 = 18 electrons, like argon.', 'Li⁺ has 3 − 1 = 2 electrons, like helium.'] },
    { l: 3, q: `What is the electron configuration of an element with atomic number 13?`, o: ['2, 8, 3', '2, 8, 2, 1', '2, 11', '8, 2, 3'], a: 0, e: `13 electrons: 2 in the first shell, 8 in the second, 3 in the third. It is aluminium.`, w: ['', 'The third shell fills before a fourth one starts.', 'The second shell holds only 8.', 'The first shell holds only 2, and it fills first.'] },
    { l: 3, q: `Element X has two isotopes: ⁶X (7.5%) and ⁷X (92.5%). Find its relative atomic mass.`, o: ['6.9', '6.5', '6.1', '7.0'], a: 0, e: `(6 × 7.5 + 7 × 92.5) ÷ 100 = (45 + 647.5) ÷ 100 = 6.925 ≈ 6.9. It is lithium.`, w: ['', '6.5 is the plain average. Weight by the percentages.', 'The common isotope is ⁷X, so the answer must be close to 7.', 'It is close to 7 but not exactly 7, because some ⁶X is present.'] },
    { l: 3, q: `How many electrons can a p sub-level hold?`, o: ['6', '2', '8', '10'], a: 0, e: `A p sub-level has three orbitals, each holding 2 electrons: 6 in all.`, w: ['', '2 is the capacity of an s sub-level.', '8 is the capacity of the second shell (2s and 2p together).', '10 is the capacity of a d sub-level.'] },
    { l: 4, q: `Which configuration belongs to a group II element?`, o: ['1s² 2s² 2p⁶ 3s²', '1s² 2s² 2p⁶', '1s² 2s² 2p²', '1s² 2s² 2p⁶ 3s² 3p⁶'], a: 0, e: `It has 2 electrons in its outer shell (3s²): magnesium, group II.`, w: ['', 'That has a full outer shell: neon, group 0.', 'That has 4 outer electrons (2s² 2p²): carbon, group IV.', 'That is argon, with a full outer shell.'] },
    { l: 4, q: `An ion X²⁻ has 18 electrons and 16 neutrons. What is the mass number of X?`, o: ['32', '34', '36', '18'], a: 0, e: `X²⁻ has 2 more electrons than protons, so protons = 18 − 2 = 16. Mass number = 16 + 16 = 32. It is sulphur-32.`, w: ['', 'You added 18 electrons and 16 neutrons. Use protons, not electrons.', 'The ion has gained 2 electrons, so it has fewer protons than electrons, not more.', 'Mass number is protons plus neutrons.'] },
    { l: 5, q: `Which configuration is correct for iron, Z = 26?`, o: ['1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶', '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁸', '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 4p⁶', '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4p²'], a: 0, e: `After 3p⁶ (18 electrons), 4s takes 2, then 3d takes the remaining 6.`, w: ['', '4s fills before 3d, so it should be 4s² 3d⁶.', '3d fills before 4p.', '4s fills before 3d, and 4p comes last.'] },
    { l: 5, q: `The relative atomic mass of chlorine is 35.5. It has isotopes ³⁵Cl and ³⁷Cl. What percentage is ³⁷Cl?`, o: ['25%', '75%', '50%', '35.5%'], a: 0, e: `Let x% be ³⁷Cl: 37x + 35(100 − x) = 3550, so 2x = 50 and x = 25.`, w: ['', '75% is the percentage of ³⁵Cl.', 'At 50% each the average would be 36.', '35.5 is the relative atomic mass, not a percentage.'] }
  ]
},

/* ───────────── THE PERIODIC TABLE ───────────── */
{
  id: 'c-per', name: 'The Periodic Table', sec: 'Section I · Matter and its particles',
  goals: ['Place an element in its group and period from its configuration', 'Explain trends in atomic size, ionisation energy and reactivity', 'Predict the reactions of the alkali metals and the halogens'],
  trap: `Down a group, metals get more reactive but halogens get less reactive. Metals react by losing electrons, which gets easier further from the nucleus. Halogens react by gaining them, which gets harder.`,
  parts: [
    {
      title: 'Groups and periods',
      idea: `The periodic table puts elements in order of atomic number. The period is the row: it tells you how many shells are in use. The group is the column: it tells you how many electrons are in the outer shell.`,
      g: ['ptab', { hl: ['Al'], label: 'The first 20 elements, with aluminium in period 3, group III highlighted' }], cap: `Aluminium, 2, 8, 3: three shells so period 3, three outer electrons so group III.`,
      rules: [
        `Period = number of shells. Group = number of outer electrons (group 0 has a full outer shell).`,
        `Elements in the same group have similar chemical properties.`,
        `Metals are on the left, non-metals on the right.`
      ],
      ex: {
        q: `An element has atomic number 17. Find its group and period.`,
        steps: [
          [`Configuration: 2, 8, 7`, `17 electrons.`],
          [`3 shells: period 3`, `Count the shells.`],
          [`7 outer electrons: group VII`, `It is chlorine, a halogen.`]
        ],
        why: [2, 'Why does the outer shell decide the group?', ['Outer electrons take part in reactions, so the same number means similar reactions', 'Because the group is the column number', 'The inner electrons cancel out'], ['Right. That is why fluorine, chlorine and bromine react alike.', 'That is how the table is drawn, but the reason is the outer electrons.', 'Inner electrons do not cancel. They are just not used in reactions.']]
      },
      tryit: {
        q: `Element Y has the configuration 2, 8, 8, 2. Where is it in the periodic table?`,
        ask: `Choose the position.`, o: ['Group II, period 4', 'Group IV, period 2', 'Group II, period 3', 'Group VIII, period 4'], a: 0,
        h: `Count the shells for the period and the outer electrons for the group.`, e: `Four shells: period 4. Two outer electrons: group II. It is calcium.`,
        fb: ['', 'You swapped them: 4 shells gives the period, 2 outer electrons gives the group.', 'There are 4 shells, so it is period 4.', 'The group is the number of outer electrons, 2.']
      }
    },
    {
      title: 'Trends across a period and down a group',
      idea: `Across a period, the nuclear charge grows while electrons go into the same shell, so atoms get smaller and hold their electrons more tightly. Down a group, extra shells make atoms bigger and the outer electrons easier to remove.`,
      g: ['ptab', { grp: 1, label: 'Group I highlighted: hydrogen, lithium, sodium and potassium' }], cap: `Group I: reactivity rises down the group, from lithium to potassium.`,
      rules: [
        `Across a period: atomic radius decreases, ionisation energy and electronegativity increase.`,
        `Down a group: atomic radius increases, ionisation energy and electronegativity decrease.`,
        `Metallic character decreases across a period and increases down a group.`
      ],
      ex: {
        q: `Explain why potassium is more reactive than sodium.`,
        steps: [
          [`K: 2, 8, 8, 1. Na: 2, 8, 1`, `Potassium has one more shell.`],
          [`K's outer electron is further from the nucleus and more shielded`, `Inner shells screen it from the nuclear charge.`],
          [`So it is lost more easily, and K reacts faster`, `Group I metals react by losing their outer electron.`]
        ],
        why: [1, 'Why does the extra shell matter?', ['The outer electron is held less strongly, so less energy is needed to remove it', 'More shells means more electrons to lose', 'Bigger atoms are heavier and fall into water faster'], ['Right. Its ionisation energy is lower.', 'Group I metals lose only one electron each, whatever their size.', 'Mass has nothing to do with it. The pull on the outer electron does.']]
      },
      tryit: {
        q: `Which of these atoms has the largest atomic radius?`,
        ask: `Choose the atom.`, o: ['Na', 'Mg', 'Al', 'Cl'], a: 0,
        h: `These are all in period 3. Which way does the radius go across a period?`, e: `Across period 3 the radius decreases, so sodium, on the left, is the largest.`,
        fb: ['', 'Mg is to the right of Na, so it is smaller.', 'Al is further right still, and smaller.', 'Cl is near the right end of the period: the smallest of these.']
      }
    },
    {
      title: 'The alkali metals, the halogens and the noble gases',
      idea: `Group I metals react with water to give an alkali and hydrogen. Group VII halogens are reactive non-metals, and a more reactive halogen pushes a less reactive one out of its salt. Group 0 gases have full outer shells and hardly react.`,
      rules: [
        `2Na + 2H₂O ${RA} 2NaOH + H₂. Reactivity increases down group I.`,
        `Halogen reactivity decreases down the group: F > Cl > Br > I.`,
        `Displacement: Cl₂ + 2KBr ${RA} 2KCl + Br₂, because chlorine is more reactive than bromine.`
      ],
      ex: {
        q: `Chlorine water is added to potassium iodide solution. What happens?`,
        steps: [
          [`Chlorine is above iodine in group VII`, `So chlorine is more reactive.`],
          [`Cl₂ + 2KI ${RA} 2KCl + I₂`, `Chlorine displaces iodine.`],
          [`The solution turns brown`, `Iodine forms in the solution.`]
        ],
        why: [0, 'Why does the higher halogen win?', ['Smaller halogen atoms attract electrons more strongly', 'Higher elements are always more reactive', 'Chlorine is a gas and iodine is a solid'], ['Right. Halogens react by gaining an electron, and chlorine does it more readily.', 'For group I metals it is the opposite.', 'The state is not the reason. Electron attraction is.']]
      },
      tryit: {
        q: `Which reaction takes place?`,
        ask: `Choose the one that happens.`, o: ['Br₂ + 2KI → 2KBr + I₂', 'I₂ + 2KBr → 2KI + Br₂', 'Br₂ + 2KCl → 2KBr + Cl₂', 'I₂ + 2KCl → 2KI + Cl₂'], a: 0,
        h: `A halogen only displaces one below it in the group.`, e: `Bromine is above iodine, so bromine displaces iodine.`,
        fb: ['', 'Iodine is below bromine, so it is less reactive and cannot displace it.', 'Bromine is below chlorine and cannot displace it.', 'Iodine is the least reactive of the three.']
      }
    }
  ],
  spot: { part: 1, who: 'Bisi', q: `Explain the trend in first ionisation energy down group II.`, lines: ['Down the group, atoms gain extra shells', 'The outer electrons are further from the nucleus', 'So the ionisation energy increases down the group'], bad: 2,
    okfb: ['Extra shells down a group is right.', 'Further from the nucleus is right too.'],
    o: ['Further electrons are held less tightly, so ionisation energy decreases', 'Ionisation energy stays the same in a group', 'The nuclear charge falls down the group', 'Nothing is wrong'],
    fb: ['That is it. The conclusion does not follow from her own reasons.', 'It changes clearly: from Be to Ba it falls.', 'Nuclear charge rises down a group. Shielding and distance win.', 'If ionisation energy rose, barium would be less reactive than magnesium. It is more reactive.'],
    h: ['If the electron is further away and more shielded, is it easier or harder to remove?'], fix: 'Ionisation energy decreases down the group, so the metals get more reactive.' },
  qs: [
    { l: 1, q: `Elements in the same group have the same number of`, o: ['outer-shell electrons', 'shells', 'neutrons', 'protons'], a: 0, e: `Same group, same number of outer electrons, so similar chemistry.`, w: ['', 'Same period means the same number of shells.', 'Neutron numbers vary even within one element.', 'Every element has a different number of protons.'] },
    { l: 1, q: `Which group contains the noble gases?`, o: ['Group 0', 'Group I', 'Group VII', 'Group II'], a: 0, e: `Helium, neon and argon are in group 0, with full outer shells.`, w: ['', 'Group I is the alkali metals.', 'Group VII is the halogens.', 'Group II is the alkaline earth metals.'] },
    { l: 2, dx: 1, q: `An element has the configuration 2, 8, 6. It is in`, o: ['group VI, period 3', 'group III, period 6', 'group VI, period 2', 'group VIII, period 3'], a: 0, e: `Three shells: period 3. Six outer electrons: group VI. It is sulphur.`, w: ['', 'You swapped them. Shells give the period, outer electrons give the group.', 'There are three shells, so period 3.', 'The group is the outer electrons, 6.'] },
    { l: 2, q: `What gas is given off when sodium reacts with water?`, o: ['Hydrogen', 'Oxygen', 'Chlorine', 'Carbon dioxide'], a: 0, e: `2Na + 2H₂O → 2NaOH + H₂.`, w: ['', 'The oxygen stays in the sodium hydroxide.', 'There is no chlorine in sodium or water.', 'There is no carbon in sodium or water.'] },
    { l: 2, q: `Which of these is the most reactive metal?`, o: ['K', 'Na', 'Li', 'Mg'], a: 0, e: `Reactivity rises down group I, and potassium is lowest of these.`, w: ['', 'Sodium is above potassium, so less reactive.', 'Lithium is the least reactive group I metal here.', 'Group II metals are less reactive than group I metals in the same period.'] },
    { l: 3, q: `Across a period from left to right, the atomic radius`, o: ['decreases', 'increases', 'stays the same', 'first increases then decreases'], a: 0, e: `Nuclear charge rises while electrons go into the same shell, so they are pulled in closer.`, w: ['', 'It increases down a group, not across a period.', 'It changes steadily across a period.', 'It falls steadily across a period.'] },
    { l: 3, q: `Which halogen is the most reactive?`, o: ['Fluorine', 'Chlorine', 'Bromine', 'Iodine'], a: 0, e: `Halogen reactivity decreases down group VII, so fluorine, at the top, is the most reactive.`, w: ['', 'Chlorine is very reactive, but fluorine is more.', 'Bromine is below chlorine, less reactive.', 'Iodine is the least reactive of these.'] },
    { l: 3, q: `Why are the noble gases unreactive?`, o: ['Their outer shells are full', 'They are gases', 'They have no electrons', 'Their atoms are very large'], a: 0, e: `A full outer shell is stable, so they have no need to lose, gain or share electrons.`, w: ['', 'Hydrogen and chlorine are gases and react readily.', 'All atoms have electrons.', 'Helium is the smallest atom of all, and it is unreactive.'] },
    { l: 4, q: `Which has the highest first ionisation energy?`, o: ['Ne', 'Na', 'Mg', 'Ar'], a: 0, e: `Ionisation energy rises across a period and falls down a group. Neon is at the end of period 2, above argon.`, w: ['', 'Sodium has the lowest here: one electron in a new shell.', 'Magnesium is low, near the start of period 3.', 'Argon is below neon, so its outer electrons are further away.'] },
    { l: 4, q: `Aqueous bromine is added to potassium chloride solution. What is seen?`, o: ['No reaction', 'Chlorine gas is given off', 'The solution turns colourless', 'A white precipitate forms'], a: 0, e: `Bromine is less reactive than chlorine, so it cannot displace chloride. The orange colour of bromine stays.`, w: ['', 'Bromine cannot push chlorine out.', 'The bromine colour stays because nothing reacts.', 'No precipitate forms.'] },
    { l: 5, q: `Element Z is in group I, period 4. Which statement about Z is correct?`, o: ['It reacts more vigorously with water than sodium', 'It has the configuration 2, 8, 1', 'It forms Z²⁺ ions', 'It is a gas at room temperature'], a: 0, e: `Z is potassium, below sodium in group I, so it is more reactive.`, w: ['', '2, 8, 1 is sodium, period 3. Z is 2, 8, 8, 1.', 'Group I metals lose one electron to form Z⁺.', 'Group I elements, apart from hydrogen, are solid metals.'] },
    { l: 5, q: `Which statement explains why reactivity decreases down group VII?`, o: ['The atoms get bigger, so they attract an extra electron less strongly', 'The atoms lose electrons less easily', 'The nuclear charge decreases', 'They have more outer electrons'], a: 0, e: `Halogens react by gaining an electron. Bigger atoms, with more shielding, pull it in less strongly.`, w: ['', 'Halogens react by gaining electrons, not losing them.', 'Nuclear charge increases down a group.', 'Every halogen has 7 outer electrons.'] }
  ]
},

/* ───────────── CHEMICAL BONDING ───────────── */
{
  id: 'c-bond', name: 'Chemical Bonding', sec: 'Section I · Matter and its particles',
  goals: ['Explain ionic bonding and write ionic formulae', 'Draw covalent bonds, including double, triple and dative bonds', 'Link bonding and forces to properties and shapes'],
  trap: `Ionic compounds conduct only when molten or dissolved, because only then can the ions move. Solid sodium chloride does not conduct.`,
  parts: [
    {
      title: 'Ionic bonding: giving and taking electrons',
      idea: `A metal atom gives its outer electrons to a non-metal atom. Both end up with full outer shells. The metal becomes a positive ion, the non-metal a negative ion, and the opposite charges hold them together.`,
      g: ['dotx', { ion: [['Na', '+', 8], ['Cl', '−', 8]], moved: 1, label: 'Sodium ion with a full shell of 8 and a chloride ion with 8, one of them the electron from sodium' }], cap: `Na (2, 8, 1) gives its outer electron to Cl (2, 8, 7). The cross is the electron that came from sodium.`,
      rules: [
        `The charge on the ion: group I, II, III metals give +1, +2, +3. Group V, VI, VII non-metals give −3, −2, −1.`,
        `The formula balances the charges: the total positive equals the total negative.`,
        `Ionic compounds have high melting points and conduct only when molten or dissolved.`
      ],
      ex: {
        q: `Show how magnesium and oxygen form magnesium oxide, and give its formula.`,
        steps: [
          [`Mg: 2, 8, 2. O: 2, 6`, `Magnesium has 2 outer electrons. Oxygen needs 2.`],
          [`Mg gives 2 electrons to O: Mg²⁺ and O²⁻`, `Both now have full outer shells of 8.`],
          [`Formula: MgO`, `One 2+ balances one 2−.`]
        ],
        why: [1, 'Why does magnesium give away 2 and not take 6?', ['Losing 2 electrons takes far less energy than gaining 6', 'Magnesium is bigger', 'Oxygen is more reactive'], ['Right. Metals lose their few outer electrons.', 'Size alone is not the reason.', 'It is about which change needs less energy.']]
      },
      tryit: {
        q: `What is the formula of the compound formed between aluminium (group III) and oxygen (group VI)?`,
        given: [`Aluminium forms Al³⁺. Oxygen forms O²⁻.`, `Balance the charges: 2 × (+3) = +6 and 3 × (−2) = −6.`],
        ask: `So the formula is ?`, o: [ch('Al2O3'), ch('AlO'), ch('Al3O2'), ch('AlO3')], a: 0,
        h: `Two aluminium ions and three oxide ions.`, e: `2 Al³⁺ and 3 O²⁻ give +6 and −6, so the formula is Al₂O₃.`,
        fb: ['', 'One Al³⁺ and one O²⁻ leaves +1 unbalanced.', 'That gives +9 and −4. Swap the numbers.', 'One Al³⁺ and three O²⁻ gives +3 and −6.']
      }
    },
    {
      title: 'Covalent bonding: sharing electrons',
      idea: `Two non-metal atoms share pairs of electrons so that each gets a full outer shell. One shared pair is a single bond, two pairs a double bond, three a triple bond. In a dative bond, both shared electrons come from one atom.`,
      g: ['dotx', { c: 'O', out: [['H', 1], ['H', 1]], lone: 2, label: 'Water: oxygen shares one pair with each hydrogen and has two lone pairs' }], cap: `Water: two shared pairs (one dot and one cross each) and two lone pairs on oxygen.`,
      rules: [
        `Each atom shares enough electrons to fill its outer shell: H shares 1, O shares 2, N shares 3, C shares 4.`,
        `CO₂ has two double bonds: O=C=O. N₂ has a triple bond: N≡N.`,
        `Dative bond: NH₃ + H⁺ ${RA} NH₄⁺, where nitrogen gives both electrons of the new bond.`
      ],
      ex: {
        q: `Describe the bonding in ammonia, NH₃.`,
        steps: [
          [`N: 2, 5. It needs 3 more electrons`, `H: 1. Each hydrogen needs 1 more.`],
          [`N shares one pair with each of 3 H atoms`, `Three single covalent bonds.`],
          [`N is left with one lone pair`, `5 outer electrons: 3 used in bonds, 2 left as a pair.`]
        ],
        why: [2, 'Why is there one lone pair?', ['Nitrogen has 5 outer electrons and uses only 3 in bonds', 'Hydrogen gives nitrogen a pair', 'All atoms have one lone pair'], ['Right. The 2 left over form a lone pair.', 'Each hydrogen gives just 1 electron to its bond.', 'Carbon in CH₄ has none, and oxygen in water has two.']]
      },
      tryit: {
        q: `How many shared pairs of electrons are there in a molecule of carbon dioxide?`,
        ask: `Choose the number.`, o: ['4', '2', '1', '6'], a: 0,
        h: `CO₂ is O=C=O. Each double bond is two shared pairs.`, e: `Two double bonds, each of 2 pairs: 4 shared pairs in all.`,
        fb: ['', '2 is the number of bonds, but each one is a double bond.', 'Carbon needs 4 more electrons, so it shares more than one pair.', 'That would need triple bonds.']
      }
    },
    {
      title: 'Metallic bonding, forces between molecules, and shapes',
      idea: `In a metal, positive ions sit in a sea of electrons that can move, so metals conduct. Between separate molecules there are weak forces. Hydrogen bonds are the strongest of these, and they explain why water has such a high boiling point for its size.`,
      rules: [
        `Hydrogen bonds form when H is joined to F, O or N. They give water, ammonia and ethanol higher boiling points.`,
        `Shapes: CH₄ tetrahedral (109.5°), NH₃ pyramidal (107°), H₂O bent (104.5°), CO₂ linear (180°).`,
        `Lone pairs push harder than bonding pairs, so they squeeze the bond angles.`
      ],
      ex: {
        q: `Water (M<sub>r</sub> 18) boils at 100 °C, but hydrogen sulphide (M<sub>r</sub> 34) boils at −60 °C. Explain.`,
        steps: [
          [`Both are small covalent molecules`, `Boiling only separates molecules. It does not break covalent bonds.`],
          [`Water molecules form hydrogen bonds`, `H is joined to O, which is very electronegative.`],
          [`More energy is needed to separate them`, `So water boils much higher, even though it is lighter.`]
        ],
        why: [0, 'Why does boiling not break the O–H bonds?', ['Boiling only pulls the molecules apart. The atoms inside each molecule stay joined', 'O–H bonds are weaker than hydrogen bonds', 'Water has no covalent bonds'], ['Right. Steam is still H₂O.', 'It is the other way round: covalent bonds are far stronger.', 'O–H bonds in water are covalent.']]
      },
      tryit: {
        q: `What is the shape of a carbon dioxide molecule?`,
        ask: `Choose the shape.`, o: ['Linear', 'Bent', 'Tetrahedral', 'Pyramidal'], a: 0,
        h: `Carbon has no lone pairs in CO₂, and two groups of bonds.`, e: `The two double bonds push as far apart as possible: 180°, a straight line.`,
        fb: ['', 'Water is bent, because oxygen has two lone pairs. Carbon in CO₂ has none.', 'Tetrahedral needs four groups of electrons around the centre.', 'Pyramidal needs three bonds and a lone pair, like NH₃.']
      }
    }
  ],
  spot: { part: 0, who: 'Kunle', q: `Explain why solid sodium chloride conducts electricity.`, lines: ['Sodium chloride is made of Na⁺ and Cl⁻ ions', 'Ions carry charge', 'So solid sodium chloride conducts electricity'], bad: 2,
    okfb: ['Correct: it is ionic.', 'Correct: moving ions carry current.'],
    o: ['In the solid the ions are fixed in place. It conducts only when molten or dissolved', 'Sodium chloride has no ions', 'Electrons carry the current in sodium chloride', 'Nothing is wrong'],
    fb: ['That is it. Ions must be free to move.', 'It is made of ions.', 'Ionic compounds have no free electrons.', 'Try it: solid salt does not light a bulb.'],
    h: ['Can the ions move in a solid crystal?'], fix: 'Solid NaCl does not conduct. Molten or dissolved NaCl does, because its ions can move.' },
  qs: [
    { l: 1, q: `Which type of bond forms between a metal and a non-metal?`, o: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'], a: 0, e: `The metal gives electrons to the non-metal, forming oppositely charged ions.`, w: ['', 'Covalent bonds form between non-metals.', 'Metallic bonding is between metal atoms.', 'A hydrogen bond is a force between molecules, not a bond within a compound.'] },
    { l: 1, q: `A covalent bond is a`, o: ['shared pair of electrons', 'transfer of electrons', 'sea of electrons', 'pair of ions'], a: 0, e: `Two atoms share a pair of electrons, one from each atom.`, w: ['', 'Transfer of electrons gives ionic bonding.', 'A sea of electrons is metallic bonding.', 'Ions are held by ionic bonding.'] },
    { l: 2, dx: 1, q: `What is the formula of calcium chloride? (Ca is in group II, Cl in group VII)`, o: [ch('CaCl2'), 'CaCl', ch('Ca2Cl'), ch('CaCl3')], a: 0, e: `Ca²⁺ needs two Cl⁻ ions to balance: CaCl₂.`, w: ['', 'One Cl⁻ cannot balance a 2+ charge.', 'That would be +4 and −1.', 'That would be +2 and −3.'] },
    { l: 2, q: `Which molecule contains a triple bond?`, o: [ch('N2'), ch('O2'), ch('Cl2'), ch('H2')], a: 0, e: `Each nitrogen needs 3 more electrons, so they share 3 pairs: N≡N.`, w: ['', 'O₂ has a double bond.', 'Cl₂ has a single bond.', 'H₂ has a single bond.'] },
    { l: 2, q: `Molten sodium chloride conducts electricity because`, o: ['its ions are free to move', 'it has free electrons', 'it has covalent bonds', 'its molecules are small'], a: 0, e: `Melting frees the ions from the lattice, so they can carry charge.`, w: ['', 'Ionic compounds do not have free electrons.', 'Sodium chloride is ionic.', 'Sodium chloride is not made of molecules.'] },
    { l: 3, q: `In the ammonium ion, NH₄⁺, the fourth N–H bond is a`, o: ['dative covalent bond', 'ionic bond', 'hydrogen bond', 'metallic bond'], a: 0, e: `Nitrogen's lone pair forms the bond to H⁺: both electrons come from nitrogen.`, w: ['', 'All four N–H bonds are covalent.', 'Hydrogen bonds are between molecules.', 'There is no metal here.'] },
    { l: 3, q: `What is the bond angle in methane, CH₄?`, o: ['109.5°', '104.5°', '107°', '180°'], a: 0, e: `Four bonding pairs point to the corners of a tetrahedron, 109.5° apart.`, w: ['', '104.5° is water, which has two lone pairs.', '107° is ammonia, which has one lone pair.', '180° is a linear molecule like CO₂.'] },
    { l: 3, q: `Why does ethanol have a much higher boiling point than propane, which has a similar mass?`, o: ['Ethanol molecules form hydrogen bonds', 'Ethanol is ionic', 'Ethanol has more atoms', 'Propane has a double bond'], a: 0, e: `Ethanol has an O–H group, so its molecules form hydrogen bonds with each other.`, w: ['', 'Ethanol is covalent.', 'Propane, C₃H₈, actually has more atoms (11) than ethanol (9).', 'Propane has only single bonds.'] },
    { l: 4, q: `Which statement about metals is correct?`, o: ['They conduct because of their delocalised electrons', 'They conduct because of free ions', 'They have low melting points because their bonds are weak', 'They are brittle'], a: 0, e: `The sea of electrons can flow through the metal, carrying current.`, w: ['', 'The metal ions are fixed in the lattice. The electrons move.', 'Most metals have high melting points: metallic bonds are strong.', 'Metals are malleable: the layers of ions can slide.'] },
    { l: 4, q: `How many lone pairs are on the central atom of water?`, o: ['2', '1', '0', '4'], a: 0, e: `Oxygen has 6 outer electrons, uses 2 in bonds, and keeps 4 as two lone pairs.`, w: ['', 'One lone pair is ammonia\'s nitrogen.', 'Carbon in methane has no lone pairs. Oxygen does.', 'There are 4 lone electrons, which make 2 pairs.'] },
    { l: 5, q: `Which compound has both ionic and covalent bonds?`, o: [ch('NH4Cl'), 'NaCl', ch('CH4'), ch('H2O')], a: 0, e: `NH₄⁺ and Cl⁻ are held by ionic bonds, and inside NH₄⁺ the N–H bonds are covalent.`, w: ['', 'NaCl is purely ionic.', 'CH₄ is purely covalent.', 'H₂O is purely covalent.'] },
    { l: 5, q: `Why is the bond angle in ammonia (107°) smaller than in methane (109.5°)?`, o: ['The lone pair on nitrogen repels more strongly than a bonding pair', 'Nitrogen is smaller than carbon', 'Ammonia has hydrogen bonds', 'Ammonia has fewer hydrogen atoms'], a: 0, e: `Lone pairs sit closer to the nucleus and push the bonding pairs closer together.`, w: ['', 'Size is not the main reason. The lone pair is.', 'Hydrogen bonds are between molecules. They do not change angles inside one molecule.', 'The angle depends on electron pairs, including the lone pair, not just on H atoms.'] }
  ]
}
);

/* Chemistry, Section II: Quantities and reactions */

/* pH scale strip. o = { marks: [[pH, 'label'], ...] } */
D.ph = o => {
  const R = n => Math.round(n * 10) / 10, X = p => 18 + p * 18.9, cols = ['#E5484D', '#EC5D3F', '#F0743A', '#F38C35', '#F6A733', '#F2C230', '#D9D23A', '#9BD24A', '#56C463', '#35B48A', '#2F9FB0', '#357FCB', '#4A63D6', '#5F4CD2', '#7140C4'];
  let b = cols.map((c, p) => `<rect x="${R(X(p) - 9.4)}" y="70" width="18.9" height="26" fill="${c}"/>`).join('') + `<rect class="ln" x="${R(X(0) - 9.4)}" y="70" width="${R(18.9 * 15)}" height="26" rx="3" style="stroke-width:1.2"/>`;
  for (let p = 0; p <= 14; p++) b += `<text class="tk" x="${R(X(p))}" y="110" text-anchor="middle" dy=".35em">${p}</text>`;
  b += `<text class="at" x="${R(X(3))}" y="128" text-anchor="middle" dy=".35em">acidic</text><text class="at" x="${R(X(7))}" y="128" text-anchor="middle" dy=".35em">neutral</text><text class="at" x="${R(X(11))}" y="128" text-anchor="middle" dy=".35em">alkaline</text>`;
  (o.marks || []).forEach(([p, t], i) => { const y = i % 2 ? 36 : 52; b += `<line class="ld" x1="${R(X(p))}" y1="${y + 6}" x2="${R(X(p))}" y2="70"/><text class="cl" x="${R(X(p))}" y="${y}" text-anchor="middle" dy=".35em">${t}</text>`; });
  return `<svg class="dg cg" viewBox="0 0 300 140" role="img" aria-label="${o.label || 'The pH scale from 0 to 14'}">${b}</svg>`;
};

CHEM.topics.push(

/* ───────────── THE MOLE ───────────── */
{
  id: 'c-mole', name: 'Formulae, Equations and the Mole', sec: 'Section II · Quantities and reactions',
  goals: ['Use the mole to link mass, number of particles, gas volume and concentration', 'Find empirical and molecular formulae', 'Work out reacting masses and volumes from a balanced equation'],
  trap: `Every calculation goes through moles. Change what you are given into moles, use the ratio in the balanced equation, then change the answer out of moles.`,
  parts: [
    {
      title: 'What a mole is',
      idea: `A mole is a counting unit, like a dozen, but much bigger: 6.02 × 10²³ particles. One mole of any substance has a mass equal to its relative formula mass in grams.`,
      rules: [
        `Moles = ${fr('mass', 'molar mass')}.`,
        `Number of particles = moles × 6.02 × 10²³ (Avogadro's constant).`,
        `One mole of any gas occupies 22.4 dm³ at s.t.p.`
      ],
      ex: {
        q: `How many moles are in 9.0 g of water? (H = 1, O = 16)`,
        steps: [
          [`M(H₂O) = 2 × 1 + 16 = 18 g mol⁻¹`, `Add up the relative atomic masses.`],
          [`Moles = ${fr('9.0', 18)}`, `Mass ÷ molar mass.`],
          [`= 0.50 mol`, `Half of one mole of water.`]
        ],
        why: [1, 'Why divide the mass by 18?', ['One mole of water has a mass of 18 g, so 9 g is half a mole', 'Because water has 18 atoms', 'Because 18 is bigger than 9'], ['Right. Mass ÷ mass of one mole gives the number of moles.', 'Water, H₂O, has 3 atoms. 18 is its molar mass.', 'Size is not the reason. It is the mass of one mole.']]
      },
      tryit: {
        q: `What volume does 0.25 mol of oxygen gas occupy at s.t.p.?`,
        given: [`Volume = moles × 22.4 dm³`],
        ask: `So the volume is ?`, o: ['5.6 dm³', '89.6 dm³', '22.4 dm³', '8.0 dm³'], a: 0,
        h: `Multiply 0.25 by 22.4.`, e: `0.25 × 22.4 = 5.6 dm³.`,
        fb: ['', 'You divided 22.4 by 0.25. Multiply instead.', '22.4 dm³ is the volume of one whole mole.', '8.0 g is the mass of 0.25 mol of O₂, not its volume.']
      }
    },
    {
      title: 'Empirical and molecular formulae',
      idea: `The empirical formula is the simplest whole-number ratio of atoms. The molecular formula is the actual number of each atom in a molecule, a whole-number multiple of the empirical formula.`,
      rules: [
        `For each element: mass (or %) ÷ A<sub>r</sub> gives moles.`,
        `Divide every answer by the smallest one to get the ratio.`,
        `Molecular formula = (empirical formula) × n, where n = M<sub>r</sub> ÷ empirical formula mass.`
      ],
      ex: {
        q: `A compound contains 40% carbon, 6.7% hydrogen and 53.3% oxygen. Its M<sub>r</sub> is 60. Find its empirical and molecular formulae. (C = 12, H = 1, O = 16)`,
        steps: [
          [`C: 40 ÷ 12 = 3.33. H: 6.7 ÷ 1 = 6.7. O: 53.3 ÷ 16 = 3.33`, `Divide each by its A<sub>r</sub>.`],
          [`Divide by 3.33: C 1, H 2, O 1. Empirical formula CH₂O`, `Divide by the smallest.`],
          [`CH₂O = 30, and 60 ÷ 30 = 2. Molecular formula C₂H₄O₂`, `This is ethanoic acid.`]
        ],
        why: [1, 'Why divide by the smallest number?', ['It turns the mole ratio into the simplest whole numbers', 'The smallest element is the most important', 'To make the answer smaller'], ['Right. The smallest becomes 1 and the others follow.', 'It is just the easiest way to get a whole-number ratio.', 'The aim is a whole-number ratio, not small numbers.']]
      },
      tryit: {
        q: `A hydrocarbon has the empirical formula CH₂ and M<sub>r</sub> = 56. What is its molecular formula?`,
        given: [`CH₂ = 12 + 2 = 14`, `n = 56 ÷ 14 = 4`],
        ask: `So the molecular formula is ?`, o: [ch('C4H8'), ch('C2H4'), ch('C4H2'), ch('C8H4')], a: 0,
        h: `Multiply every number in CH₂ by 4.`, e: `(CH₂) × 4 = C₄H₈, which has M<sub>r</sub> = 48 + 8 = 56.`,
        fb: ['', 'C₂H₄ has M<sub>r</sub> = 28. Multiply by 4, not 2.', 'Multiply the hydrogen too: 2 × 4 = 8.', 'You swapped the numbers of C and H.']
      }
    },
    {
      title: 'Reacting masses and gas volumes',
      idea: `A balanced equation tells you how many moles react with how many. Change the mass you know into moles, use the ratio, and change back.`,
      rules: [
        `1. Moles of what you know. 2. Use the mole ratio from the equation. 3. Change to the mass or volume asked for.`,
        `For gases at the same temperature and pressure, volumes react in the same ratio as moles (Gay-Lussac).`,
        `Mass is conserved: the total mass of the reactants equals the total mass of the products.`
      ],
      ex: {
        q: `What mass of calcium oxide is made by heating 25 g of calcium carbonate? CaCO₃ ${RA} CaO + CO₂ (Ca = 40, C = 12, O = 16)`,
        steps: [
          [`M(CaCO₃) = 100, so moles = 25 ÷ 100 = 0.25 mol`, `Step 1: moles of what you know.`],
          [`1 CaCO₃ gives 1 CaO, so 0.25 mol of CaO`, `Step 2: the ratio is 1 : 1.`],
          [`M(CaO) = 56, mass = 0.25 × 56 = 14 g`, `Step 3: back to grams.`]
        ],
        why: [1, 'Why is the mole ratio 1 : 1?', ['The balanced equation has one CaCO₃ and one CaO', 'Because the masses are equal', 'Every reaction has a 1 : 1 ratio'], ['Right. The numbers in front of each formula give the ratio.', 'The masses are not equal: 25 g gives 14 g.', 'Many reactions do not: 2H₂ + O₂ is 2 : 1.']]
      },
      tryit: {
        q: `What volume of oxygen at s.t.p. is needed to burn 2 mol of hydrogen? 2H₂ + O₂ ${RA} 2H₂O`,
        given: [`Ratio: 2 mol H₂ needs 1 mol O₂.`],
        ask: `So the volume of oxygen is ?`, o: ['22.4 dm³', '44.8 dm³', '11.2 dm³', '67.2 dm³'], a: 0,
        h: `1 mol of O₂ at s.t.p.`, e: `2 mol H₂ needs 1 mol O₂, which is 22.4 dm³ at s.t.p.`,
        fb: ['', 'That is 2 mol of oxygen. The ratio is 2 H₂ : 1 O₂.', 'That is half a mole of oxygen.', 'That is the total volume of both gases.']
      }
    }
  ],
  spot: { part: 2, who: 'Ifeoma', q: `What mass of magnesium oxide forms when 6 g of magnesium burns? 2Mg + O₂ → 2MgO (Mg = 24, O = 16)`, lines: ['Moles of Mg = 6 ÷ 24 = 0.25 mol', 'Moles of MgO = 0.25 ÷ 2 = 0.125 mol', 'Mass of MgO = 0.125 × 40 = 5 g'], bad: 1,
    okfb: ['Moles of magnesium are right.', 'The arithmetic is right for the moles she found.'],
    o: ['The ratio is 2 Mg : 2 MgO, which is 1 : 1, so there is 0.25 mol of MgO', 'M(MgO) is 56, not 40', 'She should have used 12 for magnesium', 'Nothing is wrong'],
    fb: ['That is it. Both have a 2 in front.', 'MgO = 24 + 16 = 40. That is right.', 'Magnesium\'s A<sub>r</sub> is 24.', 'Adding oxygen to 6 g of magnesium cannot give only 5 g: mass is gained, not lost.'],
    h: ['Can the oxide weigh less than the magnesium it was made from?'], fix: 'Moles of MgO = 0.25 mol, so mass = 0.25 × 40 = 10 g.' },
  qs: [
    { l: 1, q: `What is the relative molecular mass of carbon dioxide, CO₂? (C = 12, O = 16)`, o: ['44', '28', '40', '60'], a: 0, e: `12 + 2 × 16 = 44.`, w: ['', 'That is CO: one oxygen only.', 'Check: 12 + 32 = 44.', 'Two oxygens, not three.'] },
    { l: 1, q: `One mole of a gas at s.t.p. occupies`, o: ['22.4 dm³', '24.0 dm³', '1 dm³', '6.02 × 10²³ dm³'], a: 0, e: `The molar volume at s.t.p. (0 °C, 1 atm) is 22.4 dm³. At room temperature it is about 24 dm³.`, w: ['', '24 dm³ is at room temperature, not s.t.p.', 'A mole of gas is much bigger than 1 dm³.', '6.02 × 10²³ is the number of particles, not a volume.'] },
    { l: 2, dx: 1, q: `How many moles are in 20 g of sodium hydroxide, NaOH? (Na = 23, O = 16, H = 1)`, o: ['0.5 mol', '2 mol', '800 mol', '0.05 mol'], a: 0, e: `M(NaOH) = 40, so moles = 20 ÷ 40 = 0.5 mol.`, w: ['', 'You divided 40 by 20. Moles = mass ÷ molar mass.', 'You multiplied. Divide the mass by the molar mass.', 'Check the decimal point: 20 ÷ 40 = 0.5.'] },
    { l: 2, q: `How many molecules are in 2 moles of water?`, o: ['1.204 × 10²⁴', '6.02 × 10²³', '3.01 × 10²³', '36'], a: 0, e: `2 × 6.02 × 10²³ = 12.04 × 10²³ = 1.204 × 10²⁴.`, w: ['', 'That is one mole.', 'That is half a mole.', '36 g is the mass of 2 moles, not the number of molecules.'] },
    { l: 2, q: `What is the percentage by mass of nitrogen in ammonium nitrate, NH₄NO₃? (N = 14, H = 1, O = 16)`, o: ['35%', '17.5%', '28%', '60%'], a: 0, e: `M = 80, and it contains 2 N = 28. 28 ÷ 80 × 100 = 35%.`, w: ['', 'There are two nitrogen atoms, not one.', '28 is the mass of nitrogen. Divide by 80 and multiply by 100.', '60% is the oxygen: 48 ÷ 80.'] },
    { l: 3, q: `A compound is 75% carbon and 25% hydrogen by mass. What is its empirical formula? (C = 12, H = 1)`, o: [ch('CH4'), ch('C3H'), ch('CH3'), ch('C2H6')], a: 0, e: `C: 75 ÷ 12 = 6.25. H: 25 ÷ 1 = 25. Ratio 6.25 : 25 = 1 : 4, so CH₄.`, w: ['', 'You used the percentages directly. Divide each by its A<sub>r</sub> first.', 'Check: 25 ÷ 6.25 = 4, not 3.', 'C₂H₆ simplifies to CH₃, and that is not the ratio here.'] },
    { l: 3, q: `What mass of carbon dioxide forms when 12 g of carbon burns completely? C + O₂ → CO₂`, o: ['44 g', '12 g', '32 g', '22 g'], a: 0, e: `12 g of C is 1 mol, which gives 1 mol of CO₂, which is 44 g.`, w: ['', 'The carbon gains oxygen, so the mass goes up.', '32 g is the oxygen used.', 'That is half a mole of CO₂.'] },
    { l: 3, q: `What is the concentration of a solution with 4.0 g of NaOH in 250 cm³? (NaOH = 40)`, o: ['0.4 mol dm⁻³', '0.1 mol dm⁻³', '16 mol dm⁻³', '0.025 mol dm⁻³'], a: 0, e: `Moles = 4 ÷ 40 = 0.1 mol. Volume = 0.250 dm³. 0.1 ÷ 0.25 = 0.4 mol dm⁻³.`, w: ['', '0.1 is the moles. Divide by the volume in dm³.', 'You used 4.0 ÷ 0.25. Change grams to moles first.', 'You divided by 4 instead of 0.25.'] },
    { l: 4, q: `What volume of CO₂ at s.t.p. is given off when 10 g of CaCO₃ reacts with excess acid? CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂ (CaCO₃ = 100)`, o: ['2.24 dm³', '4.48 dm³', '22.4 dm³', '1.12 dm³'], a: 0, e: `10 ÷ 100 = 0.1 mol CaCO₃, giving 0.1 mol CO₂. 0.1 × 22.4 = 2.24 dm³.`, w: ['', 'The ratio is 1 CaCO₃ : 1 CO₂. The 2 belongs to HCl.', 'That is a whole mole.', 'That is 0.05 mol.'] },
    { l: 4, q: `20 cm³ of methane is burned in excess oxygen. What volume of oxygen is used? CH₄ + 2O₂ → CO₂ + 2H₂O`, o: ['40 cm³', '20 cm³', '10 cm³', '60 cm³'], a: 0, e: `Gas volumes react in the mole ratio: 1 CH₄ : 2 O₂, so 20 cm³ needs 40 cm³.`, w: ['', 'The ratio is 1 : 2, not 1 : 1.', 'You halved it. Oxygen is needed in twice the volume.', 'That includes the methane too.'] },
    { l: 5, q: `0.2 g of hydrogen combines with 1.6 g of oxygen. What is the empirical formula of the product? (H = 1, O = 16)`, o: [ch('H2O'), 'HO', ch('H2O2'), ch('HO2')], a: 0, e: `H: 0.2 ÷ 1 = 0.2 mol. O: 1.6 ÷ 16 = 0.1 mol. Ratio 2 : 1, so H₂O.`, w: ['', 'The ratio is 0.2 : 0.1 = 2 : 1.', 'H₂O₂ simplifies to HO, a 1 : 1 ratio.', 'You turned the ratio upside down.'] },
    { l: 5, q: `3.2 g of an element X combines with 0.8 g of oxygen to form XO. What is the relative atomic mass of X? (O = 16)`, o: ['64', '32', '16', '128'], a: 0, e: `Moles of O = 0.8 ÷ 16 = 0.05. XO is 1 : 1, so X is 0.05 mol too. A<sub>r</sub> = 3.2 ÷ 0.05 = 64. X is copper.`, w: ['', 'That would need X₂O.', 'You compared masses directly. Find the moles of oxygen first.', 'That would fit XO₂.'] }
  ]
},

/* ───────────── ACIDS, BASES AND SALTS ───────────── */
{
  id: 'c-acid', name: 'Acids, Bases and Salts', sec: 'Section II · Quantities and reactions',
  goals: ['Describe acids, bases and alkalis, strong and weak', 'Use pH and indicators', 'Choose a method to prepare a salt, soluble or insoluble'],
  trap: `"Strong" means fully ionised, not concentrated. A dilute solution of hydrochloric acid is still a strong acid, and concentrated ethanoic acid is still a weak one.`,
  parts: [
    {
      title: 'Acids, bases and alkalis',
      idea: `An acid gives hydrogen ions, H⁺ (as H₃O⁺), in water. A base is a proton acceptor, often a metal oxide or hydroxide. An alkali is a base that dissolves in water, giving hydroxide ions, OH⁻.`,
      rules: [
        `Strong acids (HCl, H₂SO₄, HNO₃) ionise fully in water. Weak acids (ethanoic, carbonic) only partly.`,
        `Acid + base ${RA} salt + water. Acid + carbonate ${RA} salt + water + carbon dioxide. Acid + reactive metal ${RA} salt + hydrogen.`,
        `Basicity of an acid is the number of replaceable H⁺ per molecule: HCl 1, H₂SO₄ 2, H₃PO₄ 3.`
      ],
      ex: {
        q: `Write the equation for dilute sulphuric acid reacting with sodium carbonate, and name the products.`,
        steps: [
          [`Acid + carbonate ${RA} salt + water + carbon dioxide`, `The general pattern.`],
          [`H₂SO₄ + Na₂CO₃ ${RA} Na₂SO₄ + H₂O + CO₂`, `Sulphuric acid gives sulphate salts.`],
          [`Products: sodium sulphate, water and carbon dioxide`, `The fizzing is the CO₂.`]
        ],
        why: [1, 'Why is the salt a sulphate?', ['The salt takes its negative ion from the acid: sulphuric acid gives sulphate', 'Sodium always forms sulphates', 'Because carbonate turns into sulphate on heating'], ['Right. Hydrochloric gives chlorides, nitric gives nitrates.', 'Sodium forms the salt of whichever acid it meets.', 'No heating is needed. The SO₄²⁻ comes from the acid.']]
      },
      tryit: {
        q: `What is the basicity of sulphuric acid, H₂SO₄?`,
        ask: `Choose the basicity.`, o: ['2', '1', '4', '6'], a: 0,
        h: `Count the hydrogen ions it can give.`, e: `Each H₂SO₄ can give 2 H⁺, so its basicity is 2. It can form NaHSO₄ and Na₂SO₄.`,
        fb: ['', 'That is hydrochloric acid. H₂SO₄ has two replaceable hydrogens.', '4 is the number of oxygen atoms.', 'Count only the hydrogen atoms.']
      }
    },
    {
      title: 'pH and indicators',
      idea: `pH measures how acidic or alkaline a solution is, on a scale from 0 to 14. Below 7 is acidic, 7 is neutral and above 7 is alkaline. Each step of 1 is a tenfold change in H⁺ concentration.`,
      g: ['ph', { marks: [[1, 'HCl(aq)'], [3, 'vinegar'], [7, 'pure water'], [11, 'ammonia(aq)'], [13, 'NaOH(aq)']], label: 'pH scale with hydrochloric acid at 1, vinegar at 3, pure water at 7, ammonia solution at 11 and sodium hydroxide solution at 13' }], cap: `Strong acids sit at the low end, strong alkalis at the high end.`,
      rules: [
        `Litmus: red in acid, blue in alkali.`,
        `Methyl orange: red in acid, yellow in alkali. Use it when the acid is strong and the base is weak.`,
        `Phenolphthalein: colourless in acid, pink in alkali. Use it when the base is strong and the acid is weak.`
      ],
      ex: {
        q: `Which indicator should be used to titrate ethanoic acid with sodium hydroxide?`,
        steps: [
          [`Ethanoic acid is weak. Sodium hydroxide is a strong base`, `Weak acid, strong base.`],
          [`At the end point the solution is slightly alkaline`, `Sodium ethanoate makes the solution a little alkaline.`],
          [`Use phenolphthalein`, `It changes colour in the alkaline range, at about pH 8 to 10.`]
        ],
        why: [1, 'Why is the end point alkaline?', ['Sodium ethanoate reacts with water to give a little OH⁻', 'Sodium hydroxide is always in excess', 'Ethanoic acid becomes a base'], ['Right. The salt of a weak acid and a strong base is slightly alkaline.', 'At the end point neither is in excess.', 'The acid is used up. The salt it forms is what affects the pH.']]
      },
      tryit: {
        q: `A solution turns methyl orange yellow and phenolphthalein pink. What could its pH be?`,
        ask: `Choose the pH.`, o: ['11', '3', '7', '5'], a: 0,
        h: `Both indicators are showing their alkaline colours.`, e: `Yellow methyl orange and pink phenolphthalein both mean alkaline: pH 11.`,
        fb: ['', 'At pH 3 methyl orange would be red.', 'Phenolphthalein is colourless at pH 7.', 'pH 5 is acidic. Phenolphthalein would be colourless.']
      }
    },
    {
      title: 'Preparing salts',
      idea: `How you make a salt depends on whether it dissolves. A soluble salt is made from an acid and an excess of an insoluble solid, then filtered and crystallised. An insoluble salt is made by mixing two solutions so that it falls out as a precipitate.`,
      rules: [
        `All sodium, potassium, ammonium salts and all nitrates are soluble. Most chlorides are soluble, but not AgCl or PbCl₂.`,
        `Most sulphates are soluble, but not BaSO₄, PbSO₄ or CaSO₄ (slightly). Most carbonates are insoluble, except those of Na, K and NH₄⁺.`,
        `Soluble salts of Na, K and NH₄⁺ are made by titration, because their bases are soluble and an excess cannot be filtered off.`
      ],
      ex: {
        q: `How would you prepare a pure, dry sample of barium sulphate?`,
        steps: [
          [`Barium sulphate is insoluble`, `So make it by precipitation.`],
          [`Mix barium chloride solution with sodium sulphate solution`, `BaCl₂ + Na₂SO₄ ${RA} BaSO₄ + 2NaCl. A white precipitate forms.`],
          [`Filter, wash with distilled water, and dry`, `The NaCl stays in the filtrate. Washing removes the last of it.`]
        ],
        why: [1, 'Why choose barium chloride and sodium sulphate?', ['Both are soluble: one brings Ba²⁺, the other brings SO₄²⁻', 'They are the cheapest chemicals', 'They are both insoluble'], ['Right. Each solution supplies one of the two ions.', 'Cost is not the reason. Solubility is.', 'If they were insoluble, the ions could not meet in solution.']]
      },
      tryit: {
        q: `Which salt can be prepared by adding excess copper(II) oxide to dilute sulphuric acid, filtering and crystallising?`,
        ask: `Choose the salt.`, o: ['Copper(II) sulphate', 'Copper(II) chloride', 'Copper(II) nitrate', 'Copper(II) carbonate'], a: 0,
        h: `The negative ion comes from the acid.`, e: `CuO + H₂SO₄ ${RA} CuSO₄ + H₂O: blue copper(II) sulphate.`,
        fb: ['', 'A chloride needs hydrochloric acid.', 'A nitrate needs nitric acid.', 'Copper(II) carbonate is insoluble and is not made from an acid.']
      }
    }
  ],
  spot: { part: 0, who: 'Ade', q: `Explain why a dilute solution of hydrochloric acid is a strong acid.`, lines: ['Hydrochloric acid ionises in water', 'A strong acid is a concentrated acid', 'So it is only strong when it is concentrated'], bad: 1,
    okfb: ['It does ionise in water.', 'This only follows from the wrong idea in line 2.'],
    o: ['Strong means fully ionised, not concentrated. Dilute HCl is still fully ionised', 'Hydrochloric acid does not ionise', 'Hydrochloric acid is a weak acid', 'Nothing is wrong'],
    fb: ['That is it. Strength and concentration are different ideas.', 'It ionises fully: HCl → H⁺ + Cl⁻.', 'It is one of the standard strong acids.', 'A dilute strong acid exists: 0.01 mol dm⁻³ HCl is strong and dilute.'],
    h: ['What does "strong" describe: how much acid there is, or how much of it ionises?'], fix: 'HCl is strong because it ionises completely, whatever its concentration.' },
  qs: [
    { l: 1, q: `A solution with pH 2 is`, o: ['strongly acidic', 'weakly alkaline', 'neutral', 'strongly alkaline'], a: 0, e: `pH well below 7 means strongly acidic.`, w: ['', 'Alkaline solutions have pH above 7.', 'Neutral is pH 7.', 'Strongly alkaline is near pH 14.'] },
    { l: 1, q: `Which gas is given off when an acid reacts with a carbonate?`, o: ['Carbon dioxide', 'Hydrogen', 'Oxygen', 'Chlorine'], a: 0, e: `Acid + carbonate → salt + water + carbon dioxide. It turns limewater milky.`, w: ['', 'Hydrogen comes from acid + metal.', 'No oxygen gas is given off.', 'Chlorine is not formed here.'] },
    { l: 2, dx: 1, q: `Which of these is a weak acid?`, o: ['Ethanoic acid', 'Hydrochloric acid', 'Nitric acid', 'Sulphuric acid'], a: 0, e: `Ethanoic acid ionises only partly in water.`, w: ['', 'Hydrochloric acid ionises fully: strong.', 'Nitric acid is a strong acid.', 'Sulphuric acid is a strong acid.'] },
    { l: 2, q: `What colour is phenolphthalein in an alkali?`, o: ['Pink', 'Colourless', 'Yellow', 'Red'], a: 0, e: `Phenolphthalein is colourless in acid and pink in alkali.`, w: ['', 'It is colourless in acid and neutral solutions.', 'Yellow is methyl orange in alkali.', 'Red is methyl orange or litmus in acid.'] },
    { l: 2, q: `Which salt is insoluble in water?`, o: ['Silver chloride', 'Sodium chloride', 'Potassium nitrate', 'Ammonium sulphate'], a: 0, e: `AgCl is one of the few insoluble chlorides. It forms a white precipitate.`, w: ['', 'All sodium salts are soluble.', 'All nitrates and all potassium salts are soluble.', 'All ammonium salts are soluble.'] },
    { l: 3, q: `NaHSO₄ is an example of`, o: ['an acid salt', 'a normal salt', 'a basic salt', 'a double salt'], a: 0, e: `It still has a replaceable hydrogen, so it is an acid salt.`, w: ['', 'A normal salt has no replaceable H left, like Na₂SO₄.', 'A basic salt contains OH⁻ or O²⁻, like Mg(OH)Cl.', 'A double salt has two different cations, like alum.'] },
    { l: 3, q: `Why is sodium chloride prepared by titration and not by adding excess base to the acid?`, o: ['Sodium hydroxide is soluble, so any excess cannot be filtered off', 'Sodium chloride is insoluble', 'Sodium hydroxide does not react with acid', 'The reaction is too slow'], a: 0, e: `An excess of a soluble base would stay in the solution. Titration finds the exact amounts needed.`, w: ['', 'Sodium chloride is soluble.', 'It reacts readily: NaOH + HCl → NaCl + H₂O.', 'Neutralisation is very fast.'] },
    { l: 3, q: `Which pair of solutions gives a precipitate of lead(II) sulphate?`, o: ['Lead(II) nitrate and sodium sulphate', 'Lead(II) nitrate and sodium nitrate', 'Lead(II) sulphate and water', 'Sodium sulphate and sodium chloride'], a: 0, e: `Pb(NO₃)₂ supplies Pb²⁺ and Na₂SO₄ supplies SO₄²⁻. PbSO₄ is insoluble and precipitates.`, w: ['', 'There is no sulphate ion here.', 'Lead(II) sulphate is insoluble: it cannot be a starting solution.', 'There is no lead ion here.'] },
    { l: 4, q: `Which indicator is best for titrating hydrochloric acid with ammonia solution?`, o: ['Methyl orange', 'Phenolphthalein', 'Litmus', 'Any indicator works equally well'], a: 0, e: `Strong acid and weak base: the end point is slightly acidic, where methyl orange changes.`, w: ['', 'Phenolphthalein is for a weak acid and a strong base.', 'Litmus changes too gradually for titrations.', 'The end point here is acidic, so the choice matters.'] },
    { l: 4, q: `An aqueous solution of sodium carbonate is`, o: ['alkaline', 'acidic', 'neutral', 'a strong acid'], a: 0, e: `Na₂CO₃ is the salt of a strong base and a weak acid. The carbonate ion reacts with water to give OH⁻.`, w: ['', 'Salts of strong acids and weak bases, like NH₄Cl, are acidic.', 'Only salts of a strong acid and a strong base, like NaCl, are neutral.', 'It is a salt, not an acid.'] },
    { l: 5, q: `A solution of pH 3 is diluted until its pH is 4. By how much has the H⁺ concentration fallen?`, o: ['10 times', '1 unit', '4 ÷ 3 times', '100 times'], a: 0, e: `Each pH unit is a factor of 10 in H⁺ concentration.`, w: ['', 'pH changed by 1 unit, but concentration changed tenfold.', 'pH is a log scale. It does not divide like that.', '100 times would be 2 pH units.'] },
    { l: 5, q: `Which method would you use to prepare zinc chloride crystals?`, o: ['Add excess zinc to dilute hydrochloric acid, filter, then crystallise', 'Mix zinc nitrate and sodium chloride solutions, then filter', 'Titrate zinc oxide with hydrochloric acid using an indicator', 'Heat zinc in chlorine and dissolve the product'], a: 0, e: `Zinc chloride is soluble, and zinc is an insoluble solid, so excess zinc is filtered off.`, w: ['', 'ZnCl₂ is soluble, so no precipitate forms.', 'Titration is for soluble bases. Zinc oxide is insoluble, so use excess and filter.', 'That is possible but not the standard lab method for crystals.'] }
  ]
},

/* ───────────── VOLUMETRIC ANALYSIS ───────────── */
{
  id: 'c-vol', name: 'Volumetric Analysis', sec: 'Section II · Quantities and reactions',
  goals: ['Carry out and record a titration correctly', 'Use the mole ratio to find a concentration', 'Change between mol dm⁻³ and g dm⁻³'],
  trap: `Use the mole ratio from the equation. With H₂SO₄ and NaOH it is 1 : 2, so the formula is ${fr('C<sub>A</sub>V<sub>A</sub>', 'C<sub>B</sub>V<sub>B</sub>')} = ${fr('1', '2')}, not 1.`,
  parts: [
    {
      title: 'Doing a titration',
      idea: `A titration finds exactly how much of one solution reacts with a measured volume of another. A pipette measures the alkali into a conical flask, and the acid is added from a burette until the indicator just changes colour.`,
      g: ['app', { kind: 'titr' }], cap: `The white tile makes the colour change easy to see.`,
      rules: [
        `Rinse the burette with the acid and the pipette with the alkali. Rinse the flask with distilled water only.`,
        `Read the burette at the bottom of the meniscus, to 2 decimal places, such as 23.40 cm³.`,
        `Repeat until two titres agree within 0.10 cm³, and average those concordant titres.`
      ],
      ex: {
        q: `Burette readings: rough 24.50, then 23.80, 23.70 and 24.30 cm³. Which average titre should be used?`,
        steps: [
          [`Ignore the rough titre`, `It only shows roughly where the end point is.`],
          [`23.80 and 23.70 agree within 0.10 cm³`, `These are concordant. 24.30 is not.`],
          [`Average = (23.80 + 23.70) ÷ 2 = 23.75 cm³`, `Use only the concordant titres.`]
        ],
        why: [0, 'Why ignore the rough titre?', ['It is done quickly to find the end point, so it usually overshoots', 'It is always too small', 'It is the first one, so the burette is cold'], ['Right. It is a guide, not a result.', 'It usually overshoots, so it is too big.', 'Temperature is not the reason.']]
      },
      tryit: {
        q: `Why is the conical flask rinsed with distilled water and not with the alkali?`,
        ask: `Choose the reason.`, o: ['Extra alkali left in the flask would change the amount being titrated', 'Distilled water is cheaper', 'The alkali would damage the flask', 'Water makes the colour change sharper'], a: 0,
        h: `The pipette already delivers an exact amount of alkali.`, e: `Water does not change the number of moles of alkali. Leftover alkali would add to it.`,
        fb: ['', 'Cost is not the reason. Accuracy is.', 'Glass is not damaged by dilute alkali.', 'Water does not change the colour change.']
      }
    },
    {
      title: 'Finding a concentration',
      idea: `At the end point, the moles of acid and base are in the ratio from the balanced equation. The moles in each solution are its concentration times its volume.`,
      rules: [
        `Moles = concentration (mol dm⁻³) × volume (dm³). Volume in dm³ = cm³ ÷ 1000.`,
        `${fr('C<sub>A</sub>V<sub>A</sub>', 'C<sub>B</sub>V<sub>B</sub>')} = ${fr('n<sub>A</sub>', 'n<sub>B</sub>')}, where n<sub>A</sub> : n<sub>B</sub> is the mole ratio in the equation.`,
        `Mass concentration (g dm⁻³) = molar concentration × molar mass.`
      ],
      ex: {
        q: `25.0 cm³ of 0.100 mol dm⁻³ NaOH needs 20.0 cm³ of HCl. Find the concentration of the acid. HCl + NaOH ${RA} NaCl + H₂O`,
        steps: [
          [`Moles of NaOH = 0.100 × ${fr('25.0', 1000)} = 0.00250 mol`, `Concentration × volume in dm³.`],
          [`Ratio 1 : 1, so 0.00250 mol of HCl`, `From the equation.`],
          [`C<sub>A</sub> = 0.00250 ÷ ${fr('20.0', 1000)} = 0.125 mol dm⁻³`, `Moles ÷ volume in dm³.`]
        ],
        why: [1, 'Why is the ratio 1 : 1?', ['One HCl reacts with one NaOH in the balanced equation', 'The volumes are equal', 'All acids react 1 : 1'], ['Right.', 'The volumes are 20.0 and 25.0, not equal.', 'H₂SO₄ reacts 1 : 2 with NaOH.']]
      },
      tryit: {
        q: `20.0 cm³ of H₂SO₄ neutralises 25.0 cm³ of 0.200 mol dm⁻³ NaOH. H₂SO₄ + 2NaOH ${RA} Na₂SO₄ + 2H₂O. Find the concentration of the acid.`,
        given: [`Moles of NaOH = 0.200 × 0.0250 = 0.00500 mol`, `Ratio 1 H₂SO₄ : 2 NaOH, so moles of acid = 0.00250 mol`],
        ask: `So the concentration of the acid is ?`, o: ['0.125 mol dm⁻³', '0.250 mol dm⁻³', '0.0625 mol dm⁻³', '0.160 mol dm⁻³'], a: 0,
        h: `Divide 0.00250 by 0.0200 dm³.`, e: `0.00250 ÷ 0.0200 = 0.125 mol dm⁻³.`,
        fb: ['', 'You used a 1 : 1 ratio. One H₂SO₄ reacts with two NaOH.', 'You halved twice. Divide 0.00250 by 0.0200.', 'You divided 0.200 × 20 by 25. Use the moles and the ratio.']
      }
    }
  ],
  spot: { part: 1, who: 'Musa', q: `25.0 cm³ of 0.10 mol dm⁻³ Na₂CO₃ needs 25.0 cm³ of HCl. Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂. Find the concentration of HCl.`, lines: ['Moles of Na₂CO₃ = 0.10 × 0.025 = 0.0025 mol', 'Moles of HCl = 0.0025 mol', 'Concentration = 0.0025 ÷ 0.025 = 0.10 mol dm⁻³'], bad: 1,
    okfb: ['Moles of sodium carbonate are right.', 'The division is right for the moles he used.'],
    o: ['The ratio is 1 : 2, so moles of HCl = 0.0050 mol', 'He should divide by 25.0, not 0.025', 'The volume of acid should be 50.0 cm³', 'Nothing is wrong'],
    fb: ['That is it.', 'Volumes must be in dm³: 25.0 cm³ = 0.025 dm³.', 'The volume was measured: 25.0 cm³.', 'Check the equation: there is a 2 in front of HCl.'],
    h: ['Look at the numbers in front of Na₂CO₃ and HCl in the equation.'], fix: 'Moles of HCl = 0.0050 mol, so concentration = 0.0050 ÷ 0.025 = 0.20 mol dm⁻³.' },
  qs: [
    { l: 1, q: `Which apparatus measures exactly 25.0 cm³ of solution into the conical flask?`, o: ['Pipette', 'Burette', 'Measuring cylinder', 'Beaker'], a: 0, e: `A pipette delivers one fixed volume very accurately.`, w: ['', 'The burette adds the other solution in variable amounts.', 'A measuring cylinder is not accurate enough.', 'A beaker is not a measuring instrument.'] },
    { l: 1, q: `Change 250 cm³ to dm³.`, o: ['0.250 dm³', '2.50 dm³', '25.0 dm³', '250 000 dm³'], a: 0, e: `1 dm³ = 1000 cm³, so 250 cm³ = 0.250 dm³.`, w: ['', 'Divide by 1000, not 100.', 'Divide by 1000, not 10.', 'You multiplied. Divide by 1000.'] },
    { l: 2, dx: 1, q: `How many moles of NaOH are in 25.0 cm³ of a 0.20 mol dm⁻³ solution?`, o: ['0.0050 mol', '5.0 mol', '0.050 mol', '0.0080 mol'], a: 0, e: `0.20 × 25.0 ÷ 1000 = 0.0050 mol.`, w: ['', 'You used 25.0 instead of 0.0250 dm³.', 'Check the decimal places: 0.20 × 0.025 = 0.005.', 'You divided 0.20 by 25.0.'] },
    { l: 2, q: `Two titres agree "within 0.10 cm³". Which pair is concordant?`, o: ['22.35 and 22.40', '22.35 and 22.60', '22.00 and 22.35', '21.90 and 22.35'], a: 0, e: `22.40 − 22.35 = 0.05 cm³, which is within 0.10.`, w: ['', 'They differ by 0.25 cm³.', 'They differ by 0.35 cm³.', 'They differ by 0.45 cm³.'] },
    { l: 3, q: `What is the mass concentration of 0.50 mol dm⁻³ sodium hydroxide? (NaOH = 40)`, o: ['20 g dm⁻³', '80 g dm⁻³', '0.0125 g dm⁻³', '40 g dm⁻³'], a: 0, e: `g dm⁻³ = mol dm⁻³ × molar mass = 0.50 × 40 = 20 g dm⁻³.`, w: ['', 'You divided 40 by 0.50. Multiply.', 'You divided 0.50 by 40. Multiply.', '40 g dm⁻³ would be 1.0 mol dm⁻³.'] },
    { l: 3, q: `The burette is rinsed with water but not with the acid before a titration. What happens to the titre?`, o: ['It is too large, because the acid is diluted', 'It is too small', 'It is unchanged', 'The indicator does not change colour'], a: 0, e: `Water left in the burette dilutes the acid, so more of it is needed to reach the end point.`, w: ['', 'Diluted acid needs a larger volume, not a smaller one.', 'The acid concentration has changed, so the titre changes.', 'The indicator still changes at the end point.'] },
    { l: 3, q: `20.0 cm³ of 0.15 mol dm⁻³ HCl reacts exactly with 15.0 cm³ of KOH. Find the concentration of the KOH.`, o: ['0.20 mol dm⁻³', '0.11 mol dm⁻³', '0.15 mol dm⁻³', '0.10 mol dm⁻³'], a: 0, e: `Moles HCl = 0.15 × 0.020 = 0.0030 mol. Ratio 1 : 1. C = 0.0030 ÷ 0.015 = 0.20 mol dm⁻³.`, w: ['', 'You multiplied 0.15 by 15 and divided by 20. The volumes are the other way round.', 'Different volumes reacted, so the concentrations differ.', 'Check: 0.0030 ÷ 0.015 = 0.20.'] },
    { l: 4, q: `24.0 cm³ of 0.050 mol dm⁻³ H₂SO₄ neutralises 20.0 cm³ of NaOH. Find the concentration of NaOH. (H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O)`, o: ['0.12 mol dm⁻³', '0.060 mol dm⁻³', '0.030 mol dm⁻³', '0.24 mol dm⁻³'], a: 0, e: `Moles acid = 0.050 × 0.024 = 0.0012 mol. NaOH = 2 × 0.0012 = 0.0024 mol. C = 0.0024 ÷ 0.020 = 0.12 mol dm⁻³.`, w: ['', 'You used a 1 : 1 ratio. NaOH is twice the acid.', 'You halved instead of doubling.', 'Check: 0.0024 ÷ 0.020 = 0.12.'] },
    { l: 4, q: `A solution contains 5.3 g of Na₂CO₃ in 500 cm³. What is its concentration? (Na₂CO₃ = 106)`, o: ['0.10 mol dm⁻³', '0.050 mol dm⁻³', '10.6 mol dm⁻³', '0.20 mol dm⁻³'], a: 0, e: `Moles = 5.3 ÷ 106 = 0.050 mol in 0.500 dm³, so 0.050 ÷ 0.500 = 0.10 mol dm⁻³.`, w: ['', '0.050 is the moles. Divide by 0.500 dm³.', 'You used g dm⁻³: 5.3 ÷ 0.5 = 10.6.', 'You doubled twice. 0.050 ÷ 0.500 = 0.10.'] },
    { l: 4, q: `Why is a white tile placed under the conical flask?`, o: ['To see the colour change clearly', 'To keep the flask clean', 'To stop the flask from slipping', 'To keep the solution cool'], a: 0, e: `Against white, the first permanent colour change is easy to spot.`, w: ['', 'The tile is for seeing, not cleaning.', 'It is not there for grip.', 'It has no effect on temperature.'] },
    { l: 5, q: `10.0 cm³ of a dibasic acid H₂X of concentration 0.10 mol dm⁻³ reacts with 25.0 cm³ of NaOH. What is the concentration of the NaOH?`, o: ['0.080 mol dm⁻³', '0.040 mol dm⁻³', '0.25 mol dm⁻³', '0.020 mol dm⁻³'], a: 0, e: `Dibasic means 2 H⁺: H₂X + 2NaOH. Moles acid = 0.0010, NaOH = 0.0020. C = 0.0020 ÷ 0.025 = 0.080 mol dm⁻³.`, w: ['', 'You used a 1 : 1 ratio. A dibasic acid reacts 1 : 2.', 'You turned the volumes the wrong way round.', 'You halved instead of doubling.'] },
    { l: 5, q: `A solution of ethanedioic acid, H₂C₂O₄·2H₂O, contains 6.3 g dm⁻³. What is its concentration in mol dm⁻³? (H = 1, C = 12, O = 16)`, o: ['0.050 mol dm⁻³', '0.070 mol dm⁻³', '0.10 mol dm⁻³', '0.035 mol dm⁻³'], a: 0, e: `M(H₂C₂O₄·2H₂O) = 90 + 36 = 126. 6.3 ÷ 126 = 0.050 mol dm⁻³.`, w: ['', 'You left out the water of crystallisation: 6.3 ÷ 90 = 0.070.', 'Check the molar mass: it is 126, not 63.', 'Check: 6.3 ÷ 126 = 0.050.'] }
  ]
},

/* ───────────── OXIDATION AND REDUCTION ───────────── */
{
  id: 'c-redox', name: 'Oxidation and Reduction', sec: 'Section II · Quantities and reactions',
  goals: ['Define oxidation and reduction by oxygen, hydrogen, electrons and oxidation number', 'Work out oxidation numbers', 'Identify oxidising and reducing agents'],
  trap: `The oxidising agent is the one that gets reduced, and the reducing agent is the one that gets oxidised. Many students swap them.`,
  parts: [
    {
      title: 'Oxidation and reduction',
      idea: `Oxidation and reduction always happen together, so we call them redox. Oxidation is the gain of oxygen, the loss of hydrogen, or the loss of electrons. Reduction is the opposite.`,
      rules: [
        `Oxidation is the loss of electrons. Reduction is the gain of electrons.`,
        `The oxidising agent takes electrons and is itself reduced. The reducing agent gives electrons and is itself oxidised.`,
        `Common oxidising agents: O₂, Cl₂, KMnO₄, K₂Cr₂O₇, conc. HNO₃. Common reducing agents: H₂, C, CO, H₂S, reactive metals.`
      ],
      ex: {
        q: `Zinc is put into copper(II) sulphate solution: Zn + Cu²⁺ ${RA} Zn²⁺ + Cu. What is oxidised and what is reduced?`,
        steps: [
          [`Zn ${RA} Zn²⁺ + 2e⁻`, `Zinc loses electrons: it is oxidised.`],
          [`Cu²⁺ + 2e⁻ ${RA} Cu`, `Copper ions gain electrons: they are reduced.`],
          [`Reducing agent: Zn. Oxidising agent: Cu²⁺`, `Each agent causes the change in the other.`]
        ],
        why: [2, 'Why is zinc the reducing agent?', ['It gives electrons to Cu²⁺, which reduces the Cu²⁺', 'It is reduced', 'It is a metal'], ['Right. The reducing agent is oxidised itself.', 'Zinc loses electrons, so it is oxidised, not reduced.', 'Copper is a metal too. What matters is who gives electrons.']]
      },
      tryit: {
        q: `In CuO + H₂ ${RA} Cu + H₂O, which substance is the oxidising agent?`,
        ask: `Choose the oxidising agent.`, o: ['CuO', ch('H2'), 'Cu', ch('H2O')], a: 0,
        h: `Which substance loses oxygen? That one is reduced.`, e: `CuO loses oxygen, so it is reduced. It oxidises the hydrogen: it is the oxidising agent.`,
        fb: ['', 'Hydrogen gains oxygen, so it is oxidised. It is the reducing agent.', 'Copper is a product.', 'Water is a product.']
      }
    },
    {
      title: 'Oxidation numbers',
      idea: `An oxidation number is the charge an atom would have if all its bonds were ionic. An increase in oxidation number is oxidation, and a decrease is reduction.`,
      rules: [
        `Elements: 0. Simple ions: their charge. O is −2 (−1 in peroxides). H is +1 (−1 in metal hydrides). Group I is +1, group II is +2.`,
        `The oxidation numbers in a compound add up to 0. In an ion they add up to its charge.`,
        `Names show oxidation numbers: iron(III) chloride has Fe at +3.`
      ],
      ex: {
        q: `Find the oxidation number of manganese in KMnO₄.`,
        steps: [
          [`K is +1. O is −2, and there are 4 of them: −8`, `Use the fixed values first.`],
          [`+1 + Mn + (−8) = 0`, `The compound is neutral.`],
          [`Mn = +7`, `This is why KMnO₄ is such a strong oxidising agent.`]
        ],
        why: [1, 'Why does the sum equal 0?', ['KMnO₄ has no overall charge', 'Manganese is always 0', 'Potassium cancels the oxygen'], ['Right. In an ion like MnO₄⁻ the sum would be −1.', 'Only uncombined elements are 0.', '+1 does not cancel −8. Manganese makes up the difference.']]
      },
      tryit: {
        q: `What is the oxidation number of chromium in K₂Cr₂O₇?`,
        given: [`2(+1) + 2Cr + 7(−2) = 0`, `2 + 2Cr − 14 = 0, so 2Cr = 12`],
        ask: `So Cr is ?`, o: ['+6', '+12', '+7', '+3'], a: 0,
        h: `There are two chromium atoms sharing +12.`, e: `Cr = +12 ÷ 2 = +6.`,
        fb: ['', '+12 is shared between two chromium atoms.', '+7 is manganese in KMnO₄.', '+3 is chromium after it has been reduced, as in Cr³⁺.']
      }
    }
  ],
  spot: { part: 0, who: 'Funmi', q: `In 2Fe²⁺ + Cl₂ → 2Fe³⁺ + 2Cl⁻, name the oxidising agent.`, lines: ['Fe²⁺ loses an electron to become Fe³⁺', 'Cl₂ gains electrons to become Cl⁻', 'So Fe²⁺ is the oxidising agent'], bad: 2,
    okfb: ['Right: Fe²⁺ is oxidised.', 'Right: chlorine is reduced.'],
    o: ['Cl₂ is the oxidising agent: it takes electrons and is reduced', 'Fe³⁺ is the oxidising agent', 'Cl⁻ is the oxidising agent', 'Nothing is wrong'],
    fb: ['That is it.', 'Fe³⁺ is a product.', 'Cl⁻ is a product.', 'The oxidising agent is the one that is reduced. That is chlorine.'],
    h: ['The oxidising agent is reduced. Which one is reduced?'], fix: 'Cl₂ is the oxidising agent. Fe²⁺ is the reducing agent.' },
  qs: [
    { l: 1, q: `Oxidation is`, o: ['loss of electrons', 'gain of electrons', 'loss of oxygen', 'gain of hydrogen'], a: 0, e: `In terms of electrons, oxidation is the loss of electrons.`, w: ['', 'Gain of electrons is reduction.', 'Loss of oxygen is reduction.', 'Gain of hydrogen is reduction.'] },
    { l: 1, q: `What is the oxidation number of any uncombined element?`, o: ['0', '+1', '−1', 'It depends on the element'], a: 0, e: `Atoms in an element are not combined with anything else, so their oxidation number is 0.`, w: ['', '+1 is hydrogen in compounds.', '−1 is chlorine in chlorides.', 'Every uncombined element is 0.'] },
    { l: 2, dx: 1, q: `What is the oxidation number of sulphur in H₂SO₄?`, o: ['+6', '+4', '−2', '+8'], a: 0, e: `2(+1) + S + 4(−2) = 0, so S = +6.`, w: ['', '+4 is sulphur in SO₂ or H₂SO₃.', '−2 is sulphur in H₂S.', 'Remember the two hydrogens: 2 + S − 8 = 0.'] },
    { l: 2, q: `In 2Mg + O₂ → 2MgO, magnesium is`, o: ['oxidised', 'reduced', 'neither oxidised nor reduced', 'the oxidising agent'], a: 0, e: `Magnesium gains oxygen and loses electrons (Mg → Mg²⁺ + 2e⁻): it is oxidised.`, w: ['', 'Oxygen is reduced.', 'Its oxidation number goes from 0 to +2.', 'Oxygen is the oxidising agent. Magnesium is the reducing agent.'] },
    { l: 2, q: `Which of these is a reducing agent?`, o: ['Carbon monoxide', 'Chlorine', 'Potassium permanganate', 'Oxygen'], a: 0, e: `CO removes oxygen from metal oxides, for example in the blast furnace: Fe₂O₃ + 3CO → 2Fe + 3CO₂.`, w: ['', 'Chlorine is an oxidising agent.', 'KMnO₄ is a strong oxidising agent.', 'Oxygen is an oxidising agent.'] },
    { l: 3, q: `What is the oxidation number of nitrogen in the nitrate ion, NO₃⁻?`, o: ['+5', '+6', '+3', '−1'], a: 0, e: `N + 3(−2) = −1, so N = +5.`, w: ['', 'The ion has a charge of −1, so the sum is −1, not 0.', '+3 is nitrogen in NO₂⁻.', '−1 is the charge on the whole ion.'] },
    { l: 3, q: `In Fe₂O₃ + 3CO → 2Fe + 3CO₂, which change is reduction?`, o: ['Fe from +3 to 0', 'C from +2 to +4', 'O from −2 to 0', 'Fe from 0 to +3'], a: 0, e: `Iron's oxidation number falls from +3 to 0: it is reduced.`, w: ['', 'An increase in oxidation number is oxidation.', 'Oxygen stays at −2 throughout.', 'Iron goes from +3 to 0, not the other way.'] },
    { l: 3, q: `Acidified potassium dichromate(VI) turns from orange to green in a test. This shows that the substance added is`, o: ['a reducing agent', 'an oxidising agent', 'an acid', 'a base'], a: 0, e: `Orange Cr₂O₇²⁻ is reduced to green Cr³⁺. Something must have reduced it.`, w: ['', 'The dichromate is the oxidising agent. The other substance reduces it.', 'The dichromate is already acidified.', 'The colour change shows redox, not neutralisation.'] },
    { l: 4, q: `Which reaction is NOT a redox reaction?`, o: ['NaOH + HCl → NaCl + H₂O', 'Zn + 2HCl → ZnCl₂ + H₂', '2Na + Cl₂ → 2NaCl', 'CuO + H₂ → Cu + H₂O'], a: 0, e: `In neutralisation no oxidation numbers change: Na +1, O −2, H +1, Cl −1 on both sides.`, w: ['', 'Zinc goes from 0 to +2 and hydrogen from +1 to 0.', 'Sodium goes from 0 to +1 and chlorine from 0 to −1.', 'Copper goes from +2 to 0 and hydrogen from 0 to +1.'] },
    { l: 4, q: `The IUPAC name of FeCl₃ is`, o: ['iron(III) chloride', 'iron(II) chloride', 'iron trichloride(III)', 'ferrous chloride'], a: 0, e: `Fe + 3(−1) = 0, so Fe = +3: iron(III) chloride.`, w: ['', 'Iron(II) chloride is FeCl₂.', 'The Roman numeral goes after the metal only.', 'Ferrous is the old name for iron(II).'] },
    { l: 5, q: `How many electrons are gained when one MnO₄⁻ ion is reduced to Mn²⁺?`, o: ['5', '7', '2', '3'], a: 0, e: `Mn goes from +7 to +2: a fall of 5, so 5 electrons are gained.`, w: ['', '+7 is the starting oxidation number, not the change.', '+2 is the final oxidation number.', 'Count the change: +7 to +2 is 5.'] },
    { l: 5, q: `In Cl₂ + 2NaOH → NaCl + NaOCl + H₂O, chlorine is`, o: ['both oxidised and reduced', 'only oxidised', 'only reduced', 'neither oxidised nor reduced'], a: 0, e: `Chlorine starts at 0. In NaCl it is −1 (reduced) and in NaOCl it is +1 (oxidised). This is disproportionation.`, w: ['', 'Some chlorine goes to −1, which is reduction.', 'Some chlorine goes to +1, which is oxidation.', 'Its oxidation number changes in both products.'] }
  ]
},

/* ───────────── ELECTROLYSIS ───────────── */
{
  id: 'c-elec', name: 'Electrolysis', sec: 'Section II · Quantities and reactions',
  goals: ['Predict the products of electrolysis at each electrode', 'Explain what decides which ion is discharged', 'Use Faraday\'s laws to calculate masses and volumes'],
  trap: `Cations go to the cathode and are reduced. Anions go to the anode and are oxidised. "Cathode" and "cation" both start with c and go together.`,
  parts: [
    {
      title: 'What happens in electrolysis',
      idea: `Electrolysis uses electricity to decompose a compound that is molten or dissolved. Positive ions move to the negative electrode, the cathode, and gain electrons. Negative ions move to the positive electrode, the anode, and lose electrons.`,
      g: ['app', { kind: 'elec', el: 'electrolyte' }], cap: `The electrolyte must be molten or dissolved, so the ions can move.`,
      rules: [
        `At the cathode: reduction. Metal ions or H⁺ gain electrons.`,
        `At the anode: oxidation. Anions lose electrons, or the anode itself dissolves if it is an active metal.`,
        `Molten lead(II) bromide: lead forms at the cathode, bromine at the anode.`
      ],
      ex: {
        q: `What forms at each electrode when molten sodium chloride is electrolysed?`,
        steps: [
          [`Ions present: Na⁺ and Cl⁻ only`, `It is molten, so there is no water.`],
          [`Cathode: Na⁺ + e⁻ ${RA} Na`, `Sodium metal forms.`],
          [`Anode: 2Cl⁻ ${RA} Cl₂ + 2e⁻`, `Chlorine gas forms.`]
        ],
        why: [0, 'Why does it matter that there is no water?', ['With water present, H⁺ and OH⁻ ions would compete to be discharged', 'Water would put out the heat', 'Water reacts with chlorine'], ['Right. In solution, hydrogen forms at the cathode instead of sodium.', 'The point is which ions are present.', 'Chlorine does react a little with water, but that is not the main point.']]
      },
      tryit: {
        q: `During electrolysis, which electrode do the anions move towards?`,
        ask: `Choose the electrode.`, o: ['The anode, which is positive', 'The cathode, which is negative', 'The anode, which is negative', 'Both electrodes equally'], a: 0,
        h: `Opposite charges attract.`, e: `Anions are negative, so they are attracted to the positive electrode, the anode.`,
        fb: ['', 'The cathode attracts the cations.', 'The anode is the positive electrode.', 'Each kind of ion moves to one electrode only.']
      }
    },
    {
      title: 'Which ion is discharged',
      idea: `In a solution there is more than one kind of ion at each electrode, because water gives H⁺ and OH⁻. Which one is discharged depends on its place in the electrochemical series, its concentration, and the electrode.`,
      rules: [
        `Cathode: ions low in the series are discharged first: Cu²⁺ and Ag⁺ before H⁺, and H⁺ before Na⁺ or K⁺.`,
        `Anode: OH⁻ is discharged before SO₄²⁻ and NO₃⁻. In concentrated chloride solutions, Cl⁻ is discharged instead of OH⁻.`,
        `A copper anode dissolves (Cu ${RA} Cu²⁺ + 2e⁻) instead of releasing oxygen. This is how copper is purified.`
      ],
      ex: {
        q: `Copper(II) sulphate solution is electrolysed with carbon electrodes. What forms at each electrode?`,
        steps: [
          [`Cathode: Cu²⁺ and H⁺. Copper is lower in the series`, `Cu²⁺ + 2e⁻ ${RA} Cu. A pink-brown coating forms.`],
          [`Anode: SO₄²⁻ and OH⁻. OH⁻ is discharged`, `4OH⁻ ${RA} 2H₂O + O₂ + 4e⁻. Bubbles of oxygen.`],
          [`The blue colour fades and the solution becomes acidic`, `Cu²⁺ is removed and H⁺ and SO₄²⁻ are left.`]
        ],
        why: [1, 'Why is OH⁻ discharged and not SO₄²⁻?', ['OH⁻ gives up its electrons more easily', 'There is more OH⁻ than SO₄²⁻', 'SO₄²⁻ is attracted to the cathode'], ['Right. Sulphate ions are very hard to discharge.', 'There is far less OH⁻, yet it is still discharged first.', 'SO₄²⁻ is negative, so it goes to the anode.']]
      },
      tryit: {
        q: `Concentrated sodium chloride solution (brine) is electrolysed. What forms at the cathode?`,
        ask: `Choose the product.`, o: ['Hydrogen', 'Sodium', 'Chlorine', 'Oxygen'], a: 0,
        h: `Compare Na⁺ and H⁺ in the electrochemical series.`, e: `H⁺ is discharged more easily than Na⁺: 2H⁺ + 2e⁻ ${RA} H₂. Sodium hydroxide is left in solution.`,
        fb: ['', 'Sodium is far too reactive to form from a solution. H⁺ is discharged instead.', 'Chlorine forms at the anode.', 'Oxygen would form at the anode, and not from concentrated brine.']
      }
    },
    {
      title: 'Faraday\'s laws',
      idea: `The amount of substance discharged depends on the charge passed. One mole of electrons carries 96 500 coulombs, called one faraday.`,
      rules: [
        `Charge Q = current I (amperes) × time t (seconds).`,
        `Moles of electrons = Q ÷ 96 500.`,
        `Moles of substance = moles of electrons ÷ the charge on its ion. Cu²⁺ needs 2 mol e⁻ per mole of Cu.`
      ],
      ex: {
        q: `A current of 2.0 A flows for 965 s through copper(II) sulphate solution. What mass of copper forms? (Cu = 63.5)`,
        steps: [
          [`Q = 2.0 × 965 = 1930 C`, `Current × time in seconds.`],
          [`Moles of e⁻ = 1930 ÷ 96 500 = 0.020 mol`, `One faraday per mole of electrons.`],
          [`Cu²⁺ + 2e⁻ ${RA} Cu: 0.010 mol Cu = 0.010 × 63.5 = 0.635 g`, `Two electrons per copper atom.`]
        ],
        why: [2, 'Why divide the moles of electrons by 2?', ['Each Cu²⁺ ion needs 2 electrons to become a copper atom', 'Because the current is 2.0 A', 'Copper has two isotopes'], ['Right.', 'The current was already used to find the charge.', 'Isotopes have nothing to do with it.']]
      },
      tryit: {
        q: `How many coulombs are needed to deposit 1 mole of silver from Ag⁺ ions?`,
        given: [`Ag⁺ + e⁻ ${RA} Ag: one electron per silver atom.`],
        ask: `So the charge is ?`, o: ['96 500 C', '193 000 C', '48 250 C', '108 C'], a: 0,
        h: `One mole of electrons.`, e: `1 mol of Ag needs 1 mol of electrons: 96 500 C, one faraday.`,
        fb: ['', 'That is 2 faradays, for a 2+ ion.', 'That is half a faraday.', '108 is the molar mass of silver, not a charge.']
      }
    }
  ],
  spot: { part: 2, who: 'Kelechi', q: `A current of 1.0 A flows for 5 minutes through silver nitrate solution. What mass of silver forms? (Ag = 108)`, lines: ['Q = I × t = 1.0 × 5 = 5 C', 'Moles of e⁻ = 5 ÷ 96 500', 'Mass of Ag = (5 ÷ 96 500) × 108 = 0.0056 g'], bad: 0,
    okfb: ['Dividing by 96 500 is the right step.', 'Multiplying by 108 is right, since Ag⁺ needs one electron.'],
    o: ['Time must be in seconds: t = 300 s, so Q = 300 C', 'Silver needs 2 electrons per atom', 'He should divide by 108', 'Nothing is wrong'],
    fb: ['That is it.', 'Ag⁺ has a single charge: one electron per atom.', 'Moles × molar mass gives mass.', 'Check the units of t.'],
    h: ['What unit must time be in when you use Q = It?'], fix: 'Q = 1.0 × 300 = 300 C. Mass = (300 ÷ 96 500) × 108 = 0.336 g.' },
  qs: [
    { l: 1, q: `The negative electrode is called the`, o: ['cathode', 'anode', 'electrolyte', 'cation'], a: 0, e: `The cathode is negative. Cations are attracted to it.`, w: ['', 'The anode is positive.', 'The electrolyte is the liquid that conducts.', 'A cation is a positive ion, not an electrode.'] },
    { l: 1, q: `Which of these is an electrolyte?`, o: ['Molten sodium chloride', 'Solid sodium chloride', 'Copper wire', 'Ethanol'], a: 0, e: `An electrolyte conducts and is decomposed. Molten NaCl has ions that are free to move.`, w: ['', 'In the solid the ions cannot move.', 'Copper conducts but is not decomposed: it is a conductor, not an electrolyte.', 'Ethanol has no ions.'] },
    { l: 2, dx: 1, q: `What forms at the anode when molten lead(II) bromide is electrolysed?`, o: ['Bromine', 'Lead', 'Hydrogen', 'Oxygen'], a: 0, e: `Br⁻ ions lose electrons at the anode: 2Br⁻ → Br₂ + 2e⁻.`, w: ['', 'Lead forms at the cathode.', 'There is no hydrogen in molten PbBr₂.', 'There is no oxygen in molten PbBr₂.'] },
    { l: 2, q: `Reduction always takes place at the`, o: ['cathode', 'anode', 'both electrodes', 'positive electrode'], a: 0, e: `At the cathode, ions gain electrons: reduction.`, w: ['', 'Oxidation happens at the anode.', 'Each electrode does one job.', 'The positive electrode is the anode, where oxidation happens.'] },
    { l: 2, q: `In the purification of copper, the impure copper is used as`, o: ['the anode', 'the cathode', 'the electrolyte', 'both electrodes'], a: 0, e: `The impure anode dissolves, and pure copper is deposited on the cathode.`, w: ['', 'The pure copper is the cathode.', 'The electrolyte is copper(II) sulphate solution.', 'The two electrodes have different roles.'] },
    { l: 3, q: `In the electrolysis of dilute sulphuric acid with inert electrodes, the gases at the cathode and anode are, in order`, o: ['hydrogen and oxygen', 'oxygen and hydrogen', 'hydrogen and sulphur dioxide', 'sulphur and oxygen'], a: 0, e: `H⁺ is discharged at the cathode and OH⁻ at the anode. This is really the electrolysis of water.`, w: ['', 'You swapped them. Hydrogen forms at the cathode.', 'Sulphate is not discharged.', 'Sulphur is not formed.'] },
    { l: 3, q: `What is the ratio of the volumes of hydrogen and oxygen formed in the electrolysis of acidified water?`, o: ['2 : 1', '1 : 1', '1 : 2', '4 : 1'], a: 0, e: `4 electrons give 2H₂ at the cathode and 1O₂ at the anode.`, w: ['', 'Hydrogen needs 2 e⁻ per molecule, oxygen 4 e⁻.', 'You swapped them.', 'Check: 2H₂ : 1O₂.'] },
    { l: 3, q: `What charge passes when a current of 3.0 A flows for 10 minutes?`, o: ['1800 C', '30 C', '180 C', '18 000 C'], a: 0, e: `Q = It = 3.0 × 600 = 1800 C.`, w: ['', 'Time must be in seconds: 10 minutes is 600 s.', 'Check: 3.0 × 600.', 'Check: 10 minutes is 600 s, not 6000 s.'] },
    { l: 4, q: `What mass of aluminium is deposited by 3 faradays? (Al = 27)`, o: ['27 g', '81 g', '9 g', '3 g'], a: 0, e: `Al³⁺ + 3e⁻ → Al. 3 mol of electrons give 1 mol of Al: 27 g.`, w: ['', 'You multiplied 27 by 3. Each Al needs 3 electrons.', 'That is 1 faraday.', '3 is the number of faradays, not grams.'] },
    { l: 4, q: `The same charge passes through solutions of silver nitrate and copper(II) sulphate in series. 2.16 g of silver forms. What mass of copper forms? (Ag = 108, Cu = 64)`, o: ['0.64 g', '1.28 g', '0.32 g', '2.16 g'], a: 0, e: `Ag: 2.16 ÷ 108 = 0.020 mol, so 0.020 mol e⁻. Cu needs 2 e⁻: 0.010 mol × 64 = 0.64 g.`, w: ['', 'You forgot that Cu²⁺ needs 2 electrons.', 'You divided by 2 twice.', 'Equal charge gives equal moles of electrons, not equal masses.'] },
    { l: 5, q: `How long must a current of 5.0 A flow to deposit 0.127 g of copper? (Cu = 63.5, F = 96 500 C)`, o: ['77.2 s', '38.6 s', '154 s', '0.0013 s'], a: 0, e: `Moles of Cu = 0.0020, so moles of e⁻ = 0.0040. Q = 0.0040 × 96 500 = 386 C. t = 386 ÷ 5.0 = 77.2 s.`, w: ['', 'You forgot the factor of 2 for Cu²⁺.', 'You doubled twice.', 'That is the moles of electrons, not the time.'] },
    { l: 5, q: `Dilute sodium chloride solution is electrolysed. What forms at the anode?`, o: ['Mainly oxygen', 'Mainly chlorine', 'Sodium', 'Hydrogen'], a: 0, e: `In dilute solution there is little Cl⁻, so OH⁻ is discharged and oxygen forms. In concentrated brine, chlorine forms instead.`, w: ['', 'Chlorine forms when the solution is concentrated.', 'Sodium cannot form from a solution.', 'Hydrogen forms at the cathode.'] }
  ]
}
);

/* Chemistry, Section III: Energy, rates and equilibrium */
const KNO3 = [[0, 13], [20, 32], [40, 64], [60, 110], [80, 169]], NACL = [[0, 35.7], [20, 36], [40, 36.6], [60, 37.3], [80, 38.4]];
const SOLG = ['cplot', { xmax: 90, ymax: 180, xt: [0, 20, 40, 60, 80], yt: [40, 80, 120, 160], xl: 'Temperature / °C', yl: 'g per 100 g water', curves: [{ pts: KNO3, name: 'KNO₃' }, { pts: NACL, name: 'NaCl', alt: 1 }], label: 'Solubility curves: potassium nitrate rises steeply from 13 g at 0 °C to 169 g at 80 °C. Sodium chloride stays almost flat near 36 g.' }];
const RATEG = ['cplot', { xmax: 10, ymax: 60, xt: [2, 4, 6, 8], yt: [20, 40, 60], xl: 'Time / min', yl: 'Volume of CO₂ / cm³', curves: [{ pts: [[0, 0], [1, 30], [2, 44], [3, 50], [4, 52], [6, 53], [9.6, 53]], name: 'powder', at: 2 }, { pts: [[0, 0], [1, 12], [2, 22], [3, 30], [4, 36], [6, 45], [8, 50], [9.6, 52]], name: 'lumps', alt: 1, at: 4 }], label: 'Volume of carbon dioxide against time. The powder curve rises steeply and levels off early. The lumps curve rises slowly. Both end near the same volume.' }];

CHEM.topics.push(

/* ───────────── ENERGY CHANGES ───────────── */
{
  id: 'c-energy', name: 'Energy Changes', sec: 'Section III · Energy, rates and equilibrium',
  goals: ['Tell exothermic and endothermic reactions apart and draw their energy profiles', 'Calculate heat changes with q = mcΔT', 'Use bond energies to find ΔH'],
  trap: `Exothermic means ΔH is negative: the products have less energy than the reactants, and the surroundings get hotter. Keep the sign with the answer.`,
  parts: [
    {
      title: 'Exothermic and endothermic reactions',
      idea: `An exothermic reaction gives out heat, so its surroundings get warmer. An endothermic reaction takes in heat, so its surroundings get colder. ΔH, the enthalpy change, is negative for exothermic and positive for endothermic.`,
      g: ['eprof', { type: 'exo' }], cap: `Exothermic: the products are lower in energy than the reactants, so ΔH is negative.`,
      rules: [
        `Exothermic (ΔH negative): combustion, respiration, neutralisation, rusting.`,
        `Endothermic (ΔH positive): photosynthesis, thermal decomposition, dissolving ammonium nitrate.`,
        `Breaking bonds takes in energy. Making bonds gives out energy.`
      ],
      ex: {
        q: `When ammonium nitrate dissolves in water, the beaker feels cold. Is the change exothermic or endothermic?`,
        steps: [
          [`The beaker feels cold`, `Heat is flowing from your hand and the water into the change.`],
          [`The process takes in heat`, `That is the meaning of endothermic.`],
          [`Endothermic: ΔH is positive`, `The products have more energy than the reactants.`]
        ],
        why: [0, 'Why does the beaker feel cold if the process takes in heat?', ['The process takes heat from the water and the glass, so they cool down', 'Ammonium nitrate is a cold chemical', 'Endothermic reactions make cold'], ['Right. The heat goes into the change, not into your hand.', 'It starts at room temperature. The change takes in heat.', 'It is more exact to say they take heat from their surroundings.']]
      },
      tryit: {
        q: `Which of these is endothermic?`,
        ask: `Choose the endothermic change.`, o: ['Thermal decomposition of calcium carbonate', 'Burning methane', 'Neutralising an acid with an alkali', 'Respiration'], a: 0,
        h: `Which one needs continuous heating to keep going?`, e: `CaCO₃ ${RA} CaO + CO₂ only happens while it is heated. It takes in heat.`,
        fb: ['', 'Burning gives out heat: exothermic.', 'Neutralisation gives out heat: exothermic.', 'Respiration releases energy: exothermic.']
      }
    },
    {
      title: 'Measuring heat changes',
      idea: `In the lab the heat is passed to water, so we measure how much the water's temperature changes. The heat change is q = mcΔT, then divide by the moles that reacted to get ΔH per mole.`,
      rules: [
        `q = m × c × ΔT, with m the mass of solution in g, c = 4.2 J g⁻¹ °C⁻¹, ΔT the temperature change.`,
        `1 cm³ of dilute solution has a mass of about 1 g.`,
        `ΔH = −q ÷ moles. The sign is negative if the temperature rose.`
      ],
      ex: {
        q: `50 cm³ of 1.0 mol dm⁻³ HCl is mixed with 50 cm³ of 1.0 mol dm⁻³ NaOH. The temperature rises by 6.8 °C. Find the heat of neutralisation.`,
        steps: [
          [`q = 100 × 4.2 × 6.8 = 2856 J`, `The total volume is 100 cm³, so 100 g.`],
          [`Moles of water formed = 1.0 × 0.050 = 0.050 mol`, `H⁺ + OH⁻ ${RA} H₂O.`],
          [`ΔH = −2856 ÷ 0.050 = −57 100 J mol⁻¹ = −57.1 kJ mol⁻¹`, `Negative, because the temperature rose.`]
        ],
        why: [0, 'Why use 100 g and not 50 g?', ['Both solutions are heated, so the total mass of solution counts', 'Because the acid is 1.0 mol dm⁻³', 'Water has a density of 2'], ['Right. The heat spreads through all 100 cm³.', 'The concentration is used for the moles, not the mass.', 'Water has a density of 1 g cm⁻³.']]
      },
      tryit: {
        q: `Burning a fuel heats 200 g of water from 25 °C to 45 °C. How much heat did the water take in? (c = 4.2 J g⁻¹ °C⁻¹)`,
        given: [`ΔT = 45 − 25 = 20 °C`, `q = 200 × 4.2 × 20`],
        ask: `So q is ?`, o: ['16 800 J', '840 J', '37 800 J', '4200 J'], a: 0,
        h: `Multiply out 200 × 4.2 × 20.`, e: `q = 200 × 4.2 × 20 = 16 800 J = 16.8 kJ.`,
        fb: ['', 'That leaves out the temperature change.', 'You used 45 °C instead of the change, 20 °C.', 'That is 200 × 4.2 × 5. Use ΔT = 20.']
      }
    },
    {
      title: 'Bond energies',
      idea: `Every reaction breaks some bonds and makes new ones. If making the new bonds gives out more energy than breaking the old ones took in, the reaction is exothermic.`,
      rules: [
        `ΔH = (energy to break bonds in reactants) − (energy given out making bonds in products).`,
        `A negative answer means exothermic.`,
        `A reaction is spontaneous when ΔG = ΔH − TΔS is negative.`
      ],
      ex: {
        q: `Find ΔH for H₂ + Cl₂ ${RA} 2HCl. Bond energies (kJ mol⁻¹): H–H 436, Cl–Cl 242, H–Cl 431.`,
        steps: [
          [`Broken: 436 + 242 = 678 kJ`, `One H–H and one Cl–Cl.`],
          [`Made: 2 × 431 = 862 kJ`, `Two H–Cl bonds.`],
          [`ΔH = 678 − 862 = −184 kJ mol⁻¹`, `Negative: exothermic.`]
        ],
        why: [1, 'Why 2 × 431?', ['The equation makes two molecules of HCl, each with one H–Cl bond', 'Because chlorine is diatomic', 'Because 431 is the biggest'], ['Right. Count every bond made.', 'That explains the formula of Cl₂, not the number of H–Cl bonds.', 'Size is not the reason. The number of bonds is.']]
      },
      tryit: {
        q: `Breaking the bonds in the reactants takes in 1200 kJ. Making the bonds in the products gives out 1500 kJ. What is ΔH?`,
        ask: `Choose ΔH.`, o: ['−300 kJ', '+300 kJ', '+2700 kJ', '−2700 kJ'], a: 0,
        h: `Energy in minus energy out.`, e: `ΔH = 1200 − 1500 = −300 kJ. More energy is given out than taken in: exothermic.`,
        fb: ['', 'You subtracted the wrong way round. ΔH = broken − made.', 'Subtract, do not add.', 'Subtract, do not add.']
      }
    }
  ],
  spot: { part: 1, who: 'Ngozi', q: `25 cm³ of acid and 25 cm³ of alkali are mixed. The temperature rises by 10 °C. Find the heat given out. (c = 4.2 J g⁻¹ °C⁻¹)`, lines: ['ΔT = 10 °C', 'q = 25 × 4.2 × 10', 'q = 1050 J'], bad: 1,
    okfb: ['The temperature change is right.', 'The multiplication matches line 2.'],
    o: ['The mass is the whole mixture, 50 g, not 25 g', 'c should be 1.0', 'ΔT should be in kelvin, so 283', 'Nothing is wrong'],
    fb: ['That is it. Both solutions are warmed.', 'c for water is 4.2 J g⁻¹ °C⁻¹.', 'A change of 10 °C is a change of 10 K, not 283.', 'Both 25 cm³ portions are heated.'],
    h: ['How much liquid gets warmer: 25 cm³ or 50 cm³?'], fix: 'q = 50 × 4.2 × 10 = 2100 J.' },
  qs: [
    { l: 1, q: `In an exothermic reaction, the temperature of the surroundings`, o: ['rises', 'falls', 'stays the same', 'falls then rises'], a: 0, e: `Exothermic reactions give out heat, so their surroundings warm up.`, w: ['', 'That is endothermic.', 'Heat is given out, so the temperature changes.', 'It rises as the heat is given out.'] },
    { l: 1, q: `Which of these is exothermic?`, o: ['Combustion of fuels', 'Photosynthesis', 'Melting ice', 'Thermal decomposition of limestone'], a: 0, e: `All combustion gives out heat.`, w: ['', 'Photosynthesis takes in light energy.', 'Melting takes in heat.', 'Decomposition by heating takes in heat.'] },
    { l: 2, dx: 1, q: `The sign of ΔH for an endothermic reaction is`, o: ['positive', 'negative', 'zero', 'positive or negative'], a: 0, e: `Endothermic: the products gain energy, so ΔH > 0.`, w: ['', 'Negative is exothermic.', 'Zero would mean no energy change.', 'It is always positive for an endothermic change.'] },
    { l: 2, q: `Breaking chemical bonds is`, o: ['always endothermic', 'always exothermic', 'sometimes exothermic', 'neither'], a: 0, e: `Energy is always needed to pull bonded atoms apart.`, w: ['', 'Making bonds is exothermic.', 'Breaking bonds always needs energy.', 'It always takes in energy.'] },
    { l: 2, q: `On an energy profile, the activation energy is the height from the`, o: ['reactants up to the peak', 'products up to the peak', 'reactants down to the products', 'bottom of the graph to the peak'], a: 0, e: `The activation energy is the minimum energy the reactants need to react.`, w: ['', 'That is the activation energy of the reverse reaction.', 'That is ΔH.', 'Measure from the reactants, not from zero.'] },
    { l: 3, q: `How much heat is needed to raise 50 g of water by 12 °C? (c = 4.2 J g⁻¹ °C⁻¹)`, o: ['2520 J', '600 J', '210 J', '252 J'], a: 0, e: `q = 50 × 4.2 × 12 = 2520 J.`, w: ['', 'You left out c.', 'You left out ΔT.', 'Check the multiplication: 50 × 4.2 = 210, and 210 × 12 = 2520.'] },
    { l: 3, q: `The heat of neutralisation of any strong acid by any strong base is about −57 kJ mol⁻¹. Why is it always the same?`, o: ['The reaction is always H⁺ + OH⁻ → H₂O', 'All acids have the same mass', 'All salts have the same energy', 'Water has a fixed boiling point'], a: 0, e: `Strong acids and bases are fully ionised, so the only change is H⁺ and OH⁻ forming water.`, w: ['', 'Mass does not matter here. The ionic equation does.', 'The salt ions are spectators: they do not change.', 'Boiling point has nothing to do with it.'] },
    { l: 3, q: `Using a catalyst changes`, o: ['the activation energy only', 'ΔH only', 'both ΔH and the activation energy', 'neither'], a: 0, e: `A catalyst gives a lower-energy route. The reactants and products, and so ΔH, are unchanged.`, w: ['', 'ΔH depends only on the reactants and products.', 'ΔH is unchanged.', 'It lowers the activation energy.'] },
    { l: 4, q: `Find ΔH for CH₄ + 2O₂ → CO₂ + 2H₂O. Bond energies (kJ mol⁻¹): C–H 413, O=O 498, C=O 805, O–H 464.`, o: ['−818 kJ mol⁻¹', '+818 kJ mol⁻¹', '−1652 kJ mol⁻¹', '−404 kJ mol⁻¹'], a: 0, e: `Broken: 4 × 413 + 2 × 498 = 2648. Made: 2 × 805 + 4 × 464 = 3466. ΔH = 2648 − 3466 = −818 kJ mol⁻¹.`, w: ['', 'You subtracted the wrong way round.', 'Count every bond: methane has 4 C–H and water has 2 O–H each.', 'Check the bonds made: two C=O and four O–H.'] },
    { l: 4, q: `0.020 mol of a fuel heats 250 g of water by 20 °C. What is its heat of combustion? (c = 4.2 J g⁻¹ °C⁻¹)`, o: ['−1050 kJ mol⁻¹', '−21 kJ mol⁻¹', '−420 kJ mol⁻¹', '+1050 kJ mol⁻¹'], a: 0, e: `q = 250 × 4.2 × 20 = 21 000 J. ΔH = −21 000 ÷ 0.020 = −1 050 000 J mol⁻¹ = −1050 kJ mol⁻¹.`, w: ['', 'That is q in kJ. Divide by the moles too.', 'Check: 21 ÷ 0.020 = 1050.', 'Combustion gives out heat, so ΔH is negative.'] },
    { l: 5, q: `A reaction has ΔH = +50 kJ mol⁻¹ and ΔS = +200 J K⁻¹ mol⁻¹. Above what temperature is it spontaneous?`, o: ['250 K', '4 K', '0.25 K', '10 000 K'], a: 0, e: `ΔG = ΔH − TΔS < 0 when T > ΔH ÷ ΔS = 50 000 ÷ 200 = 250 K.`, w: ['', 'You divided ΔS by ΔH. Use ΔH ÷ ΔS.', 'Change kJ to J first: 50 kJ = 50 000 J.', 'You multiplied. Divide.'] },
    { l: 5, q: `Why do calorimetry results for combustion usually come out smaller than book values?`, o: ['Heat is lost to the surroundings and combustion is incomplete', 'The thermometer reads too high', 'Water has too high a heat capacity', 'The fuel gains mass'], a: 0, e: `Some heat warms the air and the can, and some fuel burns to soot or CO, so less heat reaches the water.`, w: ['', 'A thermometer reading too high would make the result too big.', 'c of water is fixed. It is not the source of error.', 'The fuel loses mass as it burns.'] }
  ]
},

/* ───────────── RATES OF REACTION ───────────── */
{
  id: 'c-rate', name: 'Rates of Reaction', sec: 'Section III · Energy, rates and equilibrium',
  goals: ['Explain rates using collision theory', 'Predict the effect of concentration, temperature, surface area, pressure and catalysts', 'Read rates from graphs'],
  trap: `A catalyst speeds a reaction up but is not used up and does not change the amount of product. On a graph, a catalysed reaction is steeper but ends at the same height.`,
  parts: [
    {
      title: 'Collision theory',
      idea: `Particles react only when they collide, and only if they hit with at least the activation energy. Anything that makes successful collisions happen more often makes the reaction faster.`,
      rules: [
        `Higher concentration, or higher pressure for gases: more particles in the same space, so more collisions.`,
        `Higher temperature: particles move faster and more of them have the activation energy. A 10 °C rise roughly doubles many rates.`,
        `Smaller pieces: more surface for collisions. A catalyst gives a route with a lower activation energy.`
      ],
      ex: {
        q: `Explain why a rise in temperature makes a reaction faster.`,
        steps: [
          [`The particles gain kinetic energy and move faster`, `So they collide more often.`],
          [`More of the collisions have energy equal to or above the activation energy`, `This is the bigger effect.`],
          [`So there are more successful collisions per second`, `The rate increases.`]
        ],
        why: [1, 'Why is this the bigger effect?', ['A small rise in temperature greatly increases the number of particles with enough energy', 'Because faster particles are smaller', 'Because collisions stop at low temperature'], ['Right. More collisions alone would only raise the rate a little.', 'Particle size does not change with temperature.', 'Collisions still happen when it is cold, just fewer successful ones.']]
      },
      tryit: {
        q: `Why does powdered marble react faster with acid than marble chips of the same mass?`,
        ask: `Choose the reason.`, o: ['The powder has a larger surface area, so more collisions happen', 'The powder is more concentrated', 'The powder has a lower activation energy', 'The powder is warmer'], a: 0,
        h: `Where can the acid particles collide with the marble?`, e: `Acid can only hit the surface. Powder has far more surface exposed, so more collisions per second.`,
        fb: ['', 'Concentration is about solutions and gases. Here it is the surface.', 'The activation energy depends on the reaction, not on the size of the pieces.', 'Both are at the same temperature.']
      }
    },
    {
      title: 'Reading rates from graphs',
      idea: `The rate is how fast a product forms or a reactant is used up. On a graph of product against time, the rate is the steepness. A steeper line means a faster reaction, and the line levels off when a reactant runs out.`,
      g: RATEG, cap: `Same mass of marble, same acid: the powder is faster, but both make the same amount of gas.`,
      rules: [
        `Rate = change in amount ÷ time taken. On the graph, it is the gradient.`,
        `The curve is steepest at the start, when the reactants are most concentrated.`,
        `The final height depends on the amount of the reactant that runs out, not on the speed.`
      ],
      ex: {
        q: `In the graph, what is the average rate for the powder over the first 2 minutes?`,
        steps: [
          [`At 2 minutes, the powder has given 44 cm³`, `Read from the steep curve.`],
          [`Rate = 44 ÷ 2`, `Volume ÷ time.`],
          [`= 22 cm³ per minute`, `Faster than the lumps over the same time.`]
        ],
        why: [2, 'Why does the curve flatten later?', ['A reactant gets used up, so there are fewer collisions', 'The acid cools down', 'The gas stops being made because the flask is full'], ['Right. When one reactant runs out, the reaction stops.', 'Temperature does not explain the levelling off.', 'The gas leaves the flask. A reactant running out is the reason.']]
      },
      tryit: {
        q: `The same reaction is repeated with a catalyst. How does its curve compare with the original?`,
        ask: `Choose the description.`, o: ['Steeper at first, ending at the same height', 'Steeper, ending higher', 'Less steep, ending at the same height', 'The same curve'], a: 0,
        h: `A catalyst changes the speed but not the amount of product.`, e: `It is faster, so the curve is steeper, but the same reactants give the same final amount.`,
        fb: ['', 'A catalyst does not make more product.', 'A catalyst speeds a reaction up.', 'It is faster, so the curve is steeper.']
      }
    }
  ],
  spot: { part: 0, who: 'Bola', q: `Explain how a catalyst speeds up a reaction.`, lines: ['A catalyst provides a different route for the reaction', 'It gives the particles more energy', 'So more collisions are successful'], bad: 1,
    okfb: ['Right: an alternative route.', 'More successful collisions is right, for the right reason.'],
    o: ['It does not give energy. It lowers the activation energy, so more particles already have enough', 'A catalyst is used up in the reaction', 'A catalyst increases the concentration', 'Nothing is wrong'],
    fb: ['That is it.', 'A catalyst is unchanged at the end.', 'Concentration is unchanged.', 'Catalysts do not heat the particles.'],
    h: ['Does a catalyst heat the reaction? What does it change on the energy profile?'], fix: 'A catalyst lowers the activation energy, so a larger fraction of collisions succeed.' },
  qs: [
    { l: 1, q: `Which change makes zinc react faster with hydrochloric acid?`, o: ['Using zinc powder instead of a lump', 'Using more dilute acid', 'Cooling the acid', 'Using a bigger beaker'], a: 0, e: `Powder has a larger surface area, so more collisions.`, w: ['', 'More dilute acid means fewer collisions: slower.', 'Cooling slows reactions down.', 'The size of the beaker makes no difference.'] },
    { l: 1, q: `A catalyst`, o: ['speeds up a reaction and is not used up', 'is used up in the reaction', 'changes the products', 'slows every reaction down'], a: 0, e: `A catalyst is unchanged in mass and composition at the end.`, w: ['', 'It is recovered unchanged.', 'The products are the same.', 'Most catalysts speed reactions up.'] },
    { l: 2, dx: 1, q: `Why does increasing the concentration of a reactant increase the rate?`, o: ['There are more particles in the same volume, so collisions happen more often', 'The particles move faster', 'The activation energy falls', 'The particles become bigger'], a: 0, e: `More crowded particles collide more often.`, w: ['', 'Speed depends on temperature, not concentration.', 'Only a catalyst lowers the activation energy.', 'Particle size is unchanged.'] },
    { l: 2, q: `Which factor affects the rate of reactions between gases but not between solutions?`, o: ['Pressure', 'Temperature', 'Catalyst', 'Concentration'], a: 0, e: `Pressure squeezes gas particles closer together. Liquids and solutions hardly compress.`, w: ['', 'Temperature affects all reactions.', 'Catalysts work in both.', 'Concentration matters for solutions too.'] },
    { l: 2, q: `Which reaction is speeded up by light?`, o: ['Hydrogen with chlorine', 'Magnesium with acid', 'Neutralisation', 'Rusting'], a: 0, e: `H₂ + Cl₂ → 2HCl is slow in the dark but explosive in sunlight. Photosynthesis also needs light.`, w: ['', 'Light has no real effect on this.', 'Light has no effect on neutralisation.', 'Rusting needs water and oxygen, not light.'] },
    { l: 3, q: `In the graph, which statement is correct?`, g: RATEG, o: ['The powder reacts faster, but both give the same volume of gas', 'The lumps give more gas', 'The powder gives more gas', 'The lumps react faster'], a: 0, e: `The powder curve is steeper. Both level off at the same volume because the same mass of marble was used.`, w: ['', 'Both end at about the same volume.', 'The final volume depends on the mass, which was the same.', 'The lumps curve is less steep, so slower.'] },
    { l: 3, q: `The rate of a reaction doubles for every 10 °C rise. How many times faster is it at 50 °C than at 20 °C?`, o: ['8 times', '6 times', '3 times', '30 times'], a: 0, e: `20 → 30 → 40 → 50 °C is three rises of 10 °C: 2 × 2 × 2 = 8.`, w: ['', 'Doubling three times is 2³ = 8, not 2 × 3.', 'That counts the steps, not the doublings.', 'The rate doubles, it does not rise by 10 each degree.'] },
    { l: 3, q: `Why is milk kept in a refrigerator?`, o: ['The lower temperature slows down the reactions that make it go sour', 'Cold kills all bacteria', 'Cold increases the activation energy', 'Cold makes the milk more concentrated'], a: 0, e: `Lower temperature means fewer successful collisions, so the reactions of decay are slower.`, w: ['', 'Cold slows bacteria but does not kill them all.', 'Activation energy is fixed for a reaction. Fewer particles reach it.', 'The concentration does not change.'] },
    { l: 4, q: `In an experiment, 60 cm³ of gas is collected in the first 20 s and 20 cm³ in the next 20 s. Why is the second rate lower?`, o: ['The reactants have been partly used up', 'The temperature has risen', 'A catalyst has been added', 'The gas syringe is broken'], a: 0, e: `As the reactants are used up, their concentration falls and collisions become less frequent.`, w: ['', 'A rise in temperature would speed it up.', 'A catalyst would speed it up.', 'Nothing suggests broken apparatus. Slowing down is normal.'] },
    { l: 4, q: `50 cm³ of 1 mol dm⁻³ acid reacts with excess marble. It is repeated with 100 cm³ of 0.5 mol dm⁻³ acid. What is the same in both?`, o: ['The total volume of gas made', 'The initial rate', 'The time taken to finish', 'The concentration of acid'], a: 0, e: `Both contain 0.05 mol of acid, so they make the same amount of gas. The more dilute acid reacts more slowly.`, w: ['', 'The more concentrated acid starts faster.', 'The dilute acid takes longer.', 'The concentrations are different.'] },
    { l: 5, q: `Why does a 10 °C rise often double the rate, even though the particles move only about 3% faster?`, o: ['Many more particles now have energy above the activation energy', 'The number of collisions doubles', 'The activation energy halves', 'The particles get bigger'], a: 0, e: `The fraction of particles with enough energy rises sharply, even though the collision rate rises only a little.`, w: ['', 'The collision rate rises only by a few percent.', 'The activation energy is a fixed property of the route.', 'Particle size does not change.'] },
    { l: 5, q: `Manganese(IV) oxide catalyses the decomposition of hydrogen peroxide. How can you show it is a catalyst?`, o: ['Filter, dry and weigh it after the reaction: its mass is unchanged', 'Show that it dissolves', 'Show that it changes colour', 'Show that more oxygen is made with it'], a: 0, e: `A catalyst is not used up, so the same mass is recovered. The amount of oxygen is the same with or without it.`, w: ['', 'MnO₂ does not dissolve.', 'A catalyst is chemically unchanged.', 'A catalyst does not change the amount of product.'] }
  ]
},

/* ───────────── CHEMICAL EQUILIBRIUM ───────────── */
{
  id: 'c-equil', name: 'Chemical Equilibrium', sec: 'Section III · Energy, rates and equilibrium',
  goals: ['Describe dynamic equilibrium', 'Use Le Chatelier\'s principle to predict shifts', 'Explain the conditions chosen in the Haber and Contact processes'],
  trap: `A catalyst never shifts the position of equilibrium. It only helps the system reach equilibrium sooner.`,
  parts: [
    {
      title: 'Dynamic equilibrium',
      idea: `In a reversible reaction, the products can react to give back the reactants. In a closed container the forward and backward reactions end up running at the same rate. The amounts then stay constant, although both reactions are still going on.`,
      rules: [
        `At equilibrium: forward rate = backward rate, and the concentrations stay constant.`,
        `It needs a closed system, where nothing can get in or out.`,
        `The equilibrium constant: for aA + bB ${EQM} cC + dD, K<sub>c</sub> = ${fr('[C]<sup>c</sup>[D]<sup>d</sup>', '[A]<sup>a</sup>[B]<sup>b</sup>')}.`
      ],
      ex: {
        q: `Write the expression for K<sub>c</sub> for N₂ + 3H₂ ${EQM} 2NH₃.`,
        steps: [
          [`Products on top: [NH₃]²`, `The power is the number in front of the formula.`],
          [`Reactants below: [N₂][H₂]³`, `Multiply them together.`],
          [`K<sub>c</sub> = ${fr('[NH₃]²', '[N₂][H₂]³')}`, `Square brackets mean concentration in mol dm⁻³.`]
        ],
        why: [0, 'Why is [NH₃] squared?', ['The equation has 2NH₃, and the coefficient becomes the power', 'Because ammonia has two hydrogens', 'Products are always squared'], ['Right.', 'NH₃ has three hydrogens. The power comes from the 2 in front.', 'The power depends on the coefficient in the equation.']]
      },
      tryit: {
        q: `Which statement about a system at equilibrium is true?`,
        ask: `Choose the true statement.`, o: ['The forward and backward rates are equal', 'The reactions have stopped', 'The amounts of reactants and products are equal', 'Only the forward reaction happens'], a: 0,
        h: `Equilibrium is dynamic.`, e: `Both reactions continue at the same rate, so the amounts stay constant.`,
        fb: ['', 'Both reactions are still happening. That is why it is called dynamic.', 'The amounts are constant, but not usually equal.', 'Both directions run all the time.']
      }
    },
    {
      title: 'Le Chatelier\'s principle',
      idea: `If you change the conditions of a system at equilibrium, the position of equilibrium shifts to oppose the change. Add heat, and it shifts the endothermic way. Raise the pressure, and it shifts to the side with fewer gas molecules.`,
      rules: [
        `Concentration: adding a reactant shifts the equilibrium to the right, to use it up.`,
        `Pressure: higher pressure favours the side with fewer moles of gas.`,
        `Temperature: higher temperature favours the endothermic direction. A catalyst causes no shift.`
      ],
      ex: {
        q: `N₂ + 3H₂ ${EQM} 2NH₃, ΔH = −92 kJ mol⁻¹. What is the effect of raising the pressure, and of raising the temperature, on the yield of ammonia?`,
        steps: [
          [`Moles of gas: 1 + 3 = 4 on the left, 2 on the right`, `Count the gas molecules.`],
          [`Higher pressure shifts to the right: more NH₃`, `Fewer gas molecules on the right.`],
          [`The forward reaction is exothermic, so higher temperature shifts left: less NH₃`, `The endothermic direction is the backward one.`]
        ],
        why: [2, 'Why does heating lower the yield?', ['Heating favours the endothermic direction, which is the backward reaction here', 'Ammonia boils off', 'Heating always lowers yields'], ['Right.', 'The system is closed. Boiling is not the reason.', 'For an endothermic forward reaction, heating raises the yield.']]
      },
      tryit: {
        q: `For 2SO₂ + O₂ ${EQM} 2SO₃, how does adding more oxygen affect the amount of SO₃?`,
        ask: `Choose the effect.`, o: ['It increases', 'It decreases', 'No change', 'It becomes zero'], a: 0,
        h: `The system tries to use up the oxygen you added.`, e: `The equilibrium shifts to the right to use up the extra O₂, making more SO₃.`,
        fb: ['', 'Adding a reactant shifts the equilibrium towards the products.', 'Concentration changes do shift the equilibrium.', 'The reaction does not stop.']
      }
    },
    {
      title: 'Equilibrium in industry',
      idea: `Industry chooses conditions that give a good yield, a fast rate and a reasonable cost. Often these pull in different directions, so a compromise is used.`,
      rules: [
        `Haber process (ammonia): about 450 °C, 200 atm, iron catalyst.`,
        `Contact process (sulphuric acid): 2SO₂ + O₂ ${EQM} 2SO₃ at about 450 °C, 1 to 2 atm, vanadium(V) oxide catalyst.`,
        `A lower temperature would give a better yield in both, but the reaction would be far too slow.`
      ],
      ex: {
        q: `Why does the Haber process run at 450 °C even though a lower temperature gives more ammonia?`,
        steps: [
          [`The forward reaction is exothermic`, `So low temperature gives a higher yield.`],
          [`But at low temperature the reaction is very slow`, `Even with the iron catalyst.`],
          [`450 °C is a compromise between a fair yield and a fast rate`, `Unreacted gases are recycled.`]
        ],
        why: [2, 'Why recycle the unreacted gases?', ['Only part of the gas reacts each time, so recycling stops waste', 'Recycling raises the temperature', 'Recycling changes the equilibrium constant'], ['Right. Over many passes most of it becomes ammonia.', 'Recycling does not heat the gases.', 'K<sub>c</sub> depends on temperature only.']]
      },
      tryit: {
        q: `What catalyst is used in the Contact process?`,
        ask: `Choose the catalyst.`, o: ['Vanadium(V) oxide', 'Iron', 'Nickel', 'Platinum only'], a: 0,
        h: `It is an oxide of a transition metal.`, e: `V₂O₅ catalyses 2SO₂ + O₂ ${EQM} 2SO₃.`,
        fb: ['', 'Iron is the catalyst in the Haber process.', 'Nickel is used to harden oils with hydrogen.', 'Platinum works but is too expensive and easily poisoned. V₂O₅ is used.']
      }
    }
  ],
  spot: { part: 1, who: 'Yusuf', q: `For H₂ + I₂ ⇌ 2HI, what is the effect of raising the pressure?`, lines: ['Raising the pressure favours the side with fewer gas molecules', 'The left side has 2 moles of gas', 'So the equilibrium shifts to the right'], bad: 2,
    okfb: ['That rule is right.', 'Right: 1 + 1 = 2.'],
    o: ['The right side also has 2 moles of gas, so there is no shift', 'The left side has 3 moles', 'Pressure has no effect on gases', 'Nothing is wrong'],
    fb: ['That is it. Equal moles on both sides: no shift.', '1 H₂ + 1 I₂ is 2.', 'Pressure does affect gas equilibria when the moles differ.', 'Count the moles of HI: there are 2.'],
    h: ['How many moles of gas are on the right side?'], fix: 'Both sides have 2 moles of gas, so pressure does not change the position. It only speeds both reactions up.' },
  qs: [
    { l: 1, q: `The symbol ⇌ in an equation shows that the reaction is`, o: ['reversible', 'fast', 'exothermic', 'complete'], a: 0, e: `⇌ means the reaction can go both ways.`, w: ['', 'The arrow says nothing about speed.', 'ΔH tells you that, not the arrow.', 'A reversible reaction does not go to completion.'] },
    { l: 1, q: `Dynamic equilibrium can only be reached in a`, o: ['closed system', 'open beaker', 'vacuum', 'hot system'], a: 0, e: `In a closed system nothing escapes, so the backward reaction can happen.`, w: ['', 'In an open beaker, gases escape.', 'A vacuum has nothing in it to react.', 'Temperature does not decide whether equilibrium is possible.'] },
    { l: 2, dx: 1, q: `Adding a catalyst to a system at equilibrium`, o: ['does not change the position of equilibrium', 'shifts it to the right', 'shifts it to the left', 'increases the yield'], a: 0, e: `A catalyst speeds up the forward and backward reactions equally.`, w: ['', 'A catalyst does not favour either direction.', 'A catalyst does not favour either direction.', 'The yield is unchanged. It is just reached sooner.'] },
    { l: 2, q: `In N₂ + 3H₂ ⇌ 2NH₃, how many moles of gas are on the left?`, o: ['4', '2', '3', '1'], a: 0, e: `1 N₂ + 3 H₂ = 4 moles of gas.`, w: ['', '2 is the right side.', 'Remember the N₂ as well.', 'Remember the 3H₂.'] },
    { l: 2, q: `What catalyst is used in the Haber process?`, o: ['Iron', 'Vanadium(V) oxide', 'Nickel', 'Manganese(IV) oxide'], a: 0, e: `Finely divided iron is used.`, w: ['', 'V₂O₅ is for the Contact process.', 'Nickel is for hydrogenating oils.', 'MnO₂ is for decomposing hydrogen peroxide.'] },
    { l: 3, q: `For an endothermic forward reaction, raising the temperature`, o: ['shifts the equilibrium to the right', 'shifts the equilibrium to the left', 'has no effect', 'stops the reaction'], a: 0, e: `Heating favours the endothermic direction, here the forward reaction.`, w: ['', 'That is for an exothermic forward reaction.', 'Temperature always affects equilibria with ΔH ≠ 0.', 'Reactions do not stop at equilibrium.'] },
    { l: 3, q: `For 2NO₂ (brown) ⇌ N₂O₄ (colourless), raising the pressure makes the mixture`, o: ['paler', 'darker brown', 'unchanged in colour', 'blue'], a: 0, e: `Higher pressure favours the side with fewer molecules, N₂O₄, which is colourless.`, w: ['', 'Brown NO₂ is on the side with more molecules, which is disfavoured.', 'The moles of gas differ (2 and 1), so there is a shift.', 'Neither gas is blue.'] },
    { l: 3, q: `Which change increases the value of K<sub>c</sub> for an exothermic reaction?`, o: ['Lowering the temperature', 'Raising the pressure', 'Adding a catalyst', 'Adding more reactant'], a: 0, e: `Only temperature changes K<sub>c</sub>. For an exothermic reaction, cooling increases it.`, w: ['', 'Pressure can shift the position, but K<sub>c</sub> stays the same.', 'A catalyst changes nothing about K<sub>c</sub>.', 'Concentration changes shift the position but not K<sub>c</sub>.'] },
    { l: 4, q: `Why is a pressure of 200 atm used in the Haber process and not 1000 atm?`, o: ['Very high pressure is too expensive and dangerous for the extra yield', 'Higher pressure lowers the yield', 'The catalyst stops working', 'Ammonia decomposes at high pressure'], a: 0, e: `Yield rises with pressure, but the cost of strong equipment and energy rises faster.`, w: ['', 'Higher pressure raises the yield here.', 'The catalyst works at any pressure.', 'Ammonia formation is favoured by pressure.'] },
    { l: 4, q: `For H₂ + I₂ ⇌ 2HI, the equilibrium concentrations are [H₂] = 0.1, [I₂] = 0.1 and [HI] = 0.8 mol dm⁻³. What is K<sub>c</sub>?`, o: ['64', '80', '8', '0.016'], a: 0, e: `K<sub>c</sub> = [HI]² ÷ ([H₂][I₂]) = 0.64 ÷ 0.01 = 64.`, w: ['', 'You did not square [HI].', 'Square [HI], and multiply the two below.', 'You turned the expression upside down.'] },
    { l: 5, q: `In the Contact process, SO₃ is absorbed in concentrated sulphuric acid, not water. Why?`, o: ['SO₃ with water forms a fine mist of acid that is hard to collect', 'SO₃ does not dissolve in water', 'Water is too expensive', 'Water would reverse the equilibrium'], a: 0, e: `SO₃ reacts so violently with water that an acid mist forms. It is absorbed in H₂SO₄ to give oleum, which is then diluted.`, w: ['', 'It reacts with water very readily, which is the problem.', 'Water is cheap.', 'The absorption step is after the equilibrium reactor.'] },
    { l: 5, q: `For a reaction with equal moles of gas on both sides, doubling the pressure`, o: ['speeds up both reactions but does not shift the equilibrium', 'shifts it to the right', 'shifts it to the left', 'halves K<sub>c</sub>'], a: 0, e: `Both sides are squeezed equally, so there is no shift, though collisions happen more often.`, w: ['', 'With equal moles there is no side with fewer molecules.', 'With equal moles there is no side with fewer molecules.', 'K<sub>c</sub> depends only on temperature.'] }
  ]
},

/* ───────────── WATER AND SOLUBILITY ───────────── */
{
  id: 'c-sol', name: 'Water and Solubility', sec: 'Section III · Energy, rates and equilibrium',
  goals: ['Read and use solubility curves', 'Explain hard water and how to soften it', 'Use the words deliquescent, hygroscopic and efflorescent correctly'],
  trap: `Solubility is per 100 g of water. If the question uses 50 g of water, halve the figure from the graph first.`,
  parts: [
    {
      title: 'Solubility and solubility curves',
      idea: `Solubility is the most solute that dissolves in a fixed amount of solvent at a given temperature. It is often given in grams per 100 g of water. A solution holding that much is saturated.`,
      g: SOLG, cap: `Potassium nitrate's solubility rises steeply with temperature. Sodium chloride's hardly changes.`,
      rules: [
        `For most solids, solubility rises with temperature. For gases, it falls.`,
        `Mass of crystals formed on cooling = solubility at the high temperature − solubility at the low temperature (per 100 g of water).`,
        `Solubility in mol dm⁻³ = (g per dm³ of solution) ÷ molar mass.`
      ],
      ex: {
        q: `A saturated solution of potassium nitrate in 100 g of water is cooled from 60 °C to 20 °C. What mass of crystals forms?`,
        steps: [
          [`At 60 °C: 110 g dissolves`, `Read from the curve.`],
          [`At 20 °C: 32 g dissolves`, `Read from the curve again.`],
          [`Crystals = 110 − 32 = 78 g`, `The rest cannot stay dissolved.`]
        ],
        why: [2, 'Why subtract?', ['Only 32 g can stay dissolved at 20 °C, so the rest comes out as crystals', 'Because cooling removes water', 'Because the graph goes down'], ['Right.', 'The amount of water stays at 100 g.', 'The curve goes down as you move left, but the reason is the lower solubility.']]
      },
      tryit: {
        q: `Using the graph, which salt is better for purifying by cooling a hot saturated solution?`,
        g: SOLG,
        ask: `Choose the salt.`, o: ['Potassium nitrate', 'Sodium chloride', 'Both equally', 'Neither'], a: 0,
        h: `Which one has a much lower solubility when cold?`, e: `KNO₃'s solubility falls steeply on cooling, so lots of crystals form. NaCl's hardly changes, so very few form.`,
        fb: ['', 'NaCl\'s solubility hardly changes, so cooling gives very few crystals.', 'Their curves are very different.', 'Potassium nitrate works well.']
      }
    },
    {
      title: 'Hard water',
      idea: `Hard water does not easily form a lather with soap and forms scum instead. It is caused by dissolved calcium and magnesium ions, picked up as rainwater flows over rocks.`,
      rules: [
        `Temporary hardness is caused by calcium or magnesium hydrogencarbonate. Boiling removes it: Ca(HCO₃)₂ ${RA} CaCO₃ + H₂O + CO₂.`,
        `Permanent hardness is caused by calcium or magnesium sulphate or chloride. Boiling does not remove it.`,
        `Both kinds are removed by washing soda (Na₂CO₃), ion exchange or distillation.`
      ],
      ex: {
        q: `How does washing soda soften permanently hard water containing calcium sulphate?`,
        steps: [
          [`Na₂CO₃ + CaSO₄ ${RA} CaCO₃ + Na₂SO₄`, `Washing soda is sodium carbonate.`],
          [`Calcium carbonate is insoluble, so it precipitates`, `The Ca²⁺ ions leave the water.`],
          [`Without Ca²⁺, soap lathers easily`, `The water is now soft.`]
        ],
        why: [1, 'Why does the precipitate soften the water?', ['The calcium ions that cause hardness are removed as a solid', 'Calcium carbonate is a soap', 'The sulphate ions are what make water hard'], ['Right.', 'It is an insoluble salt, not a soap.', 'Hardness is caused by Ca²⁺ and Mg²⁺, not by the sulphate.']]
      },
      tryit: {
        q: `Which method removes temporary hardness but not permanent hardness?`,
        ask: `Choose the method.`, o: ['Boiling', 'Distillation', 'Ion exchange', 'Adding washing soda'], a: 0,
        h: `One method only decomposes hydrogencarbonates.`, e: `Boiling breaks down Ca(HCO₃)₂ into insoluble CaCO₃. It does nothing to CaSO₄.`,
        fb: ['', 'Distillation removes both kinds.', 'Ion exchange removes both kinds.', 'Washing soda removes both kinds.']
      }
    },
    {
      title: 'Substances and water in the air',
      idea: `Some substances take water from the air and some give water to it. These words appear often in exams, so learn them precisely.`,
      rules: [
        `Deliquescent: absorbs so much water from the air that it dissolves in it. Examples: NaOH, CaCl₂, MgCl₂.`,
        `Hygroscopic: absorbs water from the air but does not dissolve. Examples: concentrated H₂SO₄, CaO, silica gel.`,
        `Efflorescent: loses water of crystallisation to the air. Example: washing soda, Na₂CO₃·10H₂O.`
      ],
      ex: {
        q: `Sodium hydroxide pellets left in an open dish become wet and form a solution. What property is this?`,
        steps: [
          [`The pellets take water from the air`, `They absorb moisture.`],
          [`They take in so much that they dissolve`, `A solution forms.`],
          [`This is deliquescence`, `Sodium hydroxide is deliquescent.`]
        ],
        why: [1, 'Why is it not just hygroscopic?', ['A hygroscopic substance absorbs water but does not dissolve in it', 'Hygroscopic substances give water away', 'There is no difference'], ['Right. Dissolving is the sign of deliquescence.', 'Giving away water is efflorescence.', 'The difference is whether it dissolves.']]
      },
      tryit: {
        q: `Crystals of washing soda left in air turn into a white powder. What property is this?`,
        ask: `Choose the property.`, o: ['Efflorescence', 'Deliquescence', 'Hygroscopy', 'Sublimation'], a: 0,
        h: `The crystals are losing something.`, e: `Na₂CO₃·10H₂O loses water of crystallisation to the air and crumbles to a powder: efflorescence.`,
        fb: ['', 'Deliquescence is gaining water and dissolving.', 'Hygroscopic substances gain water.', 'Sublimation is a solid turning straight to gas.']
      }
    }
  ],
  spot: { part: 0, who: 'Esther', q: `The solubility of a salt is 40 g per 100 g of water at 30 °C. What mass dissolves in 50 g of water at 30 °C?`, lines: ['Solubility = 40 g per 100 g of water', 'In 50 g of water, the mass is 40 × 2', 'So 80 g dissolves'], bad: 1,
    okfb: ['Reading the solubility is right.', 'The arithmetic follows from line 2.'],
    o: ['Half the water dissolves half as much: 40 ÷ 2 = 20 g', 'Solubility does not depend on the amount of water', 'Solubility should be divided by 30', 'Nothing is wrong'],
    fb: ['That is it.', 'Solubility is per 100 g. The amount dissolved depends on how much water there is.', 'Temperature is not used in the arithmetic.', 'Less water cannot dissolve more salt.'],
    h: ['Can 50 g of water dissolve more than 100 g of water can?'], fix: '40 g per 100 g means 20 g per 50 g.' },
  qs: [
    { l: 1, q: `A solution that cannot dissolve any more solute at that temperature is`, o: ['saturated', 'dilute', 'concentrated', 'unsaturated'], a: 0, e: `A saturated solution holds the most solute it can at that temperature.`, w: ['', 'Dilute means a small amount of solute.', 'Concentrated means a lot of solute, but not necessarily the limit.', 'Unsaturated can dissolve more.'] },
    { l: 1, q: `Which ions cause hardness in water?`, o: ['Ca²⁺ and Mg²⁺', 'Na⁺ and K⁺', 'Cl⁻ and SO₄²⁻', 'H⁺ and OH⁻'], a: 0, e: `Calcium and magnesium ions react with soap to form scum.`, w: ['', 'Sodium and potassium salts do not form scum.', 'These anions are present but do not cause hardness.', 'These are from water itself.'] },
    { l: 2, dx: 1, q: `From the graph, what is the solubility of potassium nitrate at 40 °C?`, g: SOLG, o: ['64 g per 100 g of water', '32 g per 100 g of water', '110 g per 100 g of water', '36.6 g per 100 g of water'], a: 0, e: `Reading up from 40 °C to the KNO₃ curve gives 64 g.`, w: ['', 'That is at 20 °C.', 'That is at 60 °C.', 'That is sodium chloride at 40 °C.'] },
    { l: 2, q: `The solubility of most gases in water`, o: ['falls as the temperature rises', 'rises as the temperature rises', 'does not depend on temperature', 'is zero'], a: 0, e: `Warm water holds less dissolved gas. That is why fish struggle in warm water.`, w: ['', 'That is true for most solids, not gases.', 'It clearly depends on temperature.', 'Oxygen and CO₂ dissolve in water.'] },
    { l: 2, q: `Which substance is used to dry gases because it is hygroscopic?`, o: ['Concentrated sulphuric acid', 'Washing soda', 'Sodium chloride', 'Sugar'], a: 0, e: `Concentrated H₂SO₄ absorbs water vapour without dissolving into a new solution.`, w: ['', 'Washing soda is efflorescent: it loses water.', 'Pure NaCl is not a drying agent.', 'Sugar is not a drying agent.'] },
    { l: 3, q: `Which substance is efflorescent?`, o: ['Na₂CO₃·10H₂O', 'NaOH', 'CaCl₂', 'Concentrated H₂SO₄'], a: 0, e: `Washing soda loses water of crystallisation to the air.`, w: ['', 'NaOH is deliquescent.', 'CaCl₂ is deliquescent.', 'Concentrated H₂SO₄ is hygroscopic.'] },
    { l: 3, q: `Temporary hardness is caused by`, o: ['calcium hydrogencarbonate', 'calcium sulphate', 'magnesium chloride', 'sodium chloride'], a: 0, e: `Ca(HCO₃)₂ breaks down on boiling, so the hardness can be removed.`, w: ['', 'CaSO₄ causes permanent hardness.', 'MgCl₂ causes permanent hardness.', 'NaCl does not cause hardness.'] },
    { l: 3, q: `20 g of a salt dissolves in 80 g of water at 25 °C to make a saturated solution. What is its solubility in g per 100 g of water?`, o: ['25 g', '20 g', '16 g', '80 g'], a: 0, e: `20 g in 80 g of water is the same as 25 g in 100 g.`, w: ['', 'That is per 80 g of water. Scale it to 100 g.', 'You scaled the wrong way.', '80 g is the water, not the salt.'] },
    { l: 4, q: `Using the graph, what mass of potassium nitrate crystallises when a saturated solution in 50 g of water is cooled from 80 °C to 40 °C?`, g: SOLG, o: ['52.5 g', '105 g', '64 g', '169 g'], a: 0, e: `Per 100 g: 169 − 64 = 105 g. For 50 g of water, half of that: 52.5 g.`, w: ['', 'That is for 100 g of water. Halve it.', '64 g is the solubility at 40 °C.', '169 g is the solubility at 80 °C.'] },
    { l: 4, q: `Why does hard water waste soap?`, o: ['Soap reacts with Ca²⁺ and Mg²⁺ to form insoluble scum before it lathers', 'Hard water is too cold', 'Soap dissolves too fast in hard water', 'Hard water is acidic'], a: 0, e: `The calcium and magnesium ions must be used up as scum before a lather forms.`, w: ['', 'Temperature is not the cause.', 'The soap is precipitated, not dissolved too fast.', 'Hard water is usually slightly alkaline, not acidic.'] },
    { l: 5, q: `0.585 g of NaCl dissolves in water to make 100 cm³ of a saturated solution at a certain temperature. What is its solubility in mol dm⁻³? (NaCl = 58.5)`, o: ['0.1 mol dm⁻³', '0.01 mol dm⁻³', '5.85 mol dm⁻³', '1 mol dm⁻³'], a: 0, e: `0.585 ÷ 58.5 = 0.010 mol in 0.100 dm³. 0.010 ÷ 0.100 = 0.10 mol dm⁻³.`, w: ['', '0.01 is the moles. Divide by the volume in dm³.', 'That is the mass concentration in g dm⁻³.', 'Check the decimal point: 0.010 ÷ 0.100 = 0.10.'] },
    { l: 5, q: `An ion-exchange resin softens water by`, o: ['swapping Ca²⁺ and Mg²⁺ for Na⁺ or H⁺', 'boiling the water', 'adding soap', 'removing the hydrogencarbonate ions only'], a: 0, e: `The resin holds sodium or hydrogen ions and swaps them for the calcium and magnesium ions in the water.`, w: ['', 'No heat is used.', 'Soap would form scum, not soften the water.', 'It removes the metal ions, so it works on permanent hardness too.'] }
  ]
}
);

/* Chemistry, Section IV: The elements and the environment */

/* the reactivity series with the way each metal is extracted */
D.series = o => {
  const M = ['K', 'Na', 'Ca', 'Mg', 'Al', 'C', 'Zn', 'Fe', 'Sn', 'Pb', 'H', 'Cu', 'Ag', 'Au'], y0 = 16, h = 14.5;
  let b = M.map((m, i) => { const y = y0 + i * h, nm = m === 'C' || m === 'H'; return `<text class="${nm ? 'tk' : 'ps'}" x="70" y="${y}" text-anchor="middle" dy=".35em">${nm ? `(${m === 'C' ? 'carbon' : 'hydrogen'})` : m}</text>`; }).join('');
  const br = (a, z, t) => { const ya = y0 + a * h - 6, yz = y0 + z * h + 6; return `<path class="ld" d="M118 ${ya}h8V${yz}h-8" style="stroke-opacity:.8;fill:none"/><text class="cl" x="134" y="${(ya + yz) / 2}" dy=".35em">${t}</text>`; };
  b += br(0, 4, 'electrolysis') + br(6, 9, 'reduced by carbon') + br(11, 13, 'found free, or heat alone');
  b += `<path class="ld" d="M24 ${y0}V${y0 + 13 * h}" style="stroke-opacity:.9;fill:none"/><path class="ld" d="M20 ${y0 + 6}l4-6 4 6" style="stroke-opacity:.9;fill:none"/><text class="tk" transform="rotate(-90 12 ${y0 + 6.5 * h})" x="12" y="${y0 + 6.5 * h}" text-anchor="middle" dy=".35em">more reactive</text>`;
  return `<svg class="dg cg" viewBox="0 0 300 ${y0 + 14 * h}" role="img" aria-label="${o.label || 'The reactivity series from potassium down to gold, with how each group of metals is extracted'}">${b}</svg>`;
};
/* test tubes with coloured precipitates. o = { items: [[label, colour, note], ...] } */
D.tubes = o => {
  const n = o.items.length, w = 300 / n;
  let b = o.items.map(([lab, col, note], i) => { const x = w * i + w / 2;
    return `<path class="gl" d="M${x - 11} 20v84a11 11 0 0 0 22 0v-84"/><rect class="lq" x="${x - 9}" y="52" width="18" height="52"/><path d="M${x - 9} 92v12a9 9 0 0 0 18 0v-12z" fill="${col}" fill-opacity=".95"/>`
      + `<text class="ps" x="${x}" y="132" text-anchor="middle" dy=".35em">${lab}</text><text class="tk" x="${x}" y="148" text-anchor="middle" dy=".35em">${note}</text>`; }).join('');
  return `<svg class="dg cg" viewBox="0 0 300 160" role="img" aria-label="${o.label || 'Test tubes'}">${b}</svg>`;
};
const TUBES = ['tubes', { items: [['Cu²⁺', '#3D8BFD', 'blue'], ['Fe²⁺', '#4C8B4A', 'green'], ['Fe³⁺', '#B4572A', 'red-brown'], ['Zn²⁺', '#F2F2F2', 'white']], label: 'Precipitates with sodium hydroxide: copper(II) blue, iron(II) green, iron(III) red-brown, zinc white' }];

CHEM.topics.push(

/* ───────────── AIR, OXYGEN AND HYDROGEN ───────────── */
{
  id: 'c-air', name: 'Air, Oxygen and Hydrogen', sec: 'Section IV · The elements and the environment',
  goals: ['Give the make-up of air and how its gases are separated', 'Prepare and test for oxygen and hydrogen', 'Classify oxides as acidic, basic, amphoteric or neutral'],
  trap: `Amphoteric oxides (ZnO, Al₂O₃, PbO) react with both acids and alkalis. Neutral oxides (CO, NO, N₂O, H₂O) react with neither.`,
  parts: [
    {
      title: 'The air and oxygen',
      idea: `Air is a mixture: about 78% nitrogen, 21% oxygen, 0.9% argon and 0.04% carbon dioxide, with water vapour. Oxygen is made in the lab by decomposing hydrogen peroxide with a catalyst.`,
      g: ['app', { kind: 'gas', m: 'water', what: 'H₂O₂ + MnO₂' }], cap: `Oxygen is only slightly soluble, so it is collected over water.`,
      rules: [
        `2H₂O₂ ${RA} 2H₂O + O₂, with manganese(IV) oxide as the catalyst.`,
        `Test: oxygen relights a glowing splint.`,
        `Oxygen and nitrogen are separated from liquid air by fractional distillation. Nitrogen (−196 °C) boils off before oxygen (−183 °C).`
      ],
      ex: {
        q: `100 cm³ of air is passed over heated copper until the volume stops changing. What volume is left, and why?`,
        steps: [
          [`Copper reacts with the oxygen: 2Cu + O₂ ${RA} 2CuO`, `The copper turns black.`],
          [`About 21% of air is oxygen, so 21 cm³ is used`, `The other gases do not react.`],
          [`About 79 cm³ is left, mainly nitrogen`, `This experiment shows the percentage of oxygen in air.`]
        ],
        why: [1, 'Why does the volume stop changing?', ['All the oxygen has been used up', 'The copper has melted', 'The nitrogen starts to react'], ['Right. The rest of the air does not react with copper.', 'Copper melts at over 1000 °C. It is not the reason.', 'Nitrogen does not react with hot copper.']]
      },
      tryit: {
        q: `Why is nitrogen the first gas to boil off when liquid air is warmed?`,
        ask: `Choose the reason.`, o: ['It has the lowest boiling point', 'It is the most reactive', 'It is the densest', 'It is a compound'], a: 0,
        h: `Compare −196 °C and −183 °C.`, e: `−196 °C is lower than −183 °C, so nitrogen reaches its boiling point first.`,
        fb: ['', 'Nitrogen is quite unreactive.', 'Density does not decide the order of boiling.', 'Nitrogen is an element, N₂.']
      }
    },
    {
      title: 'Oxides and hydrogen',
      idea: `Oxides are sorted by how they react. Metal oxides are usually basic, non-metal oxides usually acidic. Hydrogen, made from a metal and dilute acid, is the lightest gas and burns with a squeaky pop.`,
      rules: [
        `Acidic: CO₂, SO₂, NO₂, P₄O₁₀. Basic: Na₂O, CaO, MgO, CuO. Amphoteric: ZnO, Al₂O₃, PbO. Neutral: CO, NO, N₂O, H₂O.`,
        `Zn + 2HCl ${RA} ZnCl₂ + H₂. Hydrogen is collected over water or by upward delivery.`,
        `Uses of hydrogen: making ammonia, hardening vegetable oils into margarine (nickel catalyst), and as a fuel.`
      ],
      ex: {
        q: `Zinc oxide dissolves in both hydrochloric acid and sodium hydroxide solution. What type of oxide is it?`,
        steps: [
          [`ZnO + 2HCl ${RA} ZnCl₂ + H₂O`, `It reacts as a base with the acid.`],
          [`ZnO + 2NaOH + H₂O ${RA} Na₂Zn(OH)₄`, `It reacts as an acid with the alkali, forming a zincate.`],
          [`It is amphoteric`, `It shows both acidic and basic behaviour.`]
        ],
        why: [1, 'Why is reacting with an alkali important here?', ['Basic oxides do not react with alkalis, so this shows acidic behaviour too', 'All oxides react with alkalis', 'It shows that ZnO is neutral'], ['Right. That is what makes it amphoteric.', 'Basic oxides like CaO do not.', 'Neutral oxides react with neither acids nor alkalis.']]
      },
      tryit: {
        q: `Which oxide is neutral?`,
        ask: `Choose the oxide.`, o: ['Carbon monoxide', 'Carbon dioxide', 'Calcium oxide', 'Aluminium oxide'], a: 0,
        h: `A neutral oxide reacts with neither acids nor alkalis.`, e: `CO does not react with acids or alkalis: it is neutral.`,
        fb: ['', 'CO₂ is acidic: it reacts with alkalis.', 'CaO is basic.', 'Al₂O₃ is amphoteric.']
      }
    }
  ],
  spot: { part: 1, who: 'Sade', q: `How would you test a gas to show that it is hydrogen?`, lines: ['Collect the gas in a test tube', 'Put a glowing splint into it', 'It relights, so the gas is hydrogen'], bad: 1,
    okfb: ['Collecting the gas first is right.', 'This follows from line 2, but it is the test for oxygen.'],
    o: ['Use a burning splint: hydrogen burns with a squeaky pop', 'Bubble it through limewater', 'Use damp red litmus', 'Nothing is wrong'],
    fb: ['That is it.', 'Limewater tests for carbon dioxide.', 'Damp red litmus turning blue tests for ammonia.', 'A glowing splint relighting shows oxygen, not hydrogen.'],
    h: ['Which gas relights a glowing splint?'], fix: 'A lighted splint gives a squeaky pop with hydrogen.' },
  qs: [
    { l: 1, q: `Which gas makes up about 78% of the air?`, o: ['Nitrogen', 'Oxygen', 'Argon', 'Carbon dioxide'], a: 0, e: `Nitrogen is about 78% of dry air.`, w: ['', 'Oxygen is about 21%.', 'Argon is under 1%.', 'Carbon dioxide is about 0.04%.'] },
    { l: 1, q: `Which test identifies oxygen?`, o: ['It relights a glowing splint', 'It turns limewater milky', 'It gives a squeaky pop', 'It bleaches damp litmus'], a: 0, e: `Oxygen supports burning, so a glowing splint bursts back into flame.`, w: ['', 'Limewater tests for CO₂.', 'The pop test is for hydrogen.', 'Bleaching damp litmus is the test for chlorine.'] },
    { l: 2, dx: 1, q: `Which oxide is amphoteric?`, o: ['Al₂O₃', 'CaO', 'SO₂', 'CO'], a: 0, e: `Aluminium oxide reacts with both acids and alkalis.`, w: ['', 'CaO is basic.', 'SO₂ is acidic.', 'CO is neutral.'] },
    { l: 2, q: `What is the catalyst in the laboratory preparation of oxygen from hydrogen peroxide?`, o: ['Manganese(IV) oxide', 'Iron', 'Nickel', 'Vanadium(V) oxide'], a: 0, e: `MnO₂ speeds up 2H₂O₂ → 2H₂O + O₂.`, w: ['', 'Iron is used in the Haber process.', 'Nickel is used for hydrogenating oils.', 'V₂O₅ is used in the Contact process.'] },
    { l: 2, q: `Hydrogen can be collected by upward delivery because it is`, o: ['less dense than air', 'denser than air', 'very soluble in water', 'coloured'], a: 0, e: `Hydrogen is the lightest gas, so it rises into an upside-down jar.`, w: ['', 'Denser gases use downward delivery.', 'Hydrogen is almost insoluble.', 'Hydrogen is colourless.'] },
    { l: 3, q: `Rusting of iron needs`, o: ['both oxygen and water', 'oxygen only', 'water only', 'carbon dioxide'], a: 0, e: `Iron in dry air, or in boiled water with oil on top, does not rust.`, w: ['', 'Iron in dry air does not rust.', 'Iron in air-free water does not rust.', 'CO₂ is not needed.'] },
    { l: 3, q: `In the fractional distillation of liquid air, which gas boils off first?`, o: ['Nitrogen', 'Oxygen', 'Argon', 'They boil off together'], a: 0, e: `Nitrogen has the lowest boiling point, −196 °C.`, w: ['', 'Oxygen boils at −183 °C, higher than nitrogen.', 'Argon boils at −186 °C, between the two.', 'They have different boiling points.'] },
    { l: 3, q: `Hydrogen is used with a nickel catalyst to`, o: ['harden vegetable oils into margarine', 'make sulphuric acid', 'extract aluminium', 'purify copper'], a: 0, e: `Hydrogen adds across C=C bonds in oils, turning them solid.`, w: ['', 'That is the Contact process.', 'Aluminium is extracted by electrolysis.', 'Copper is purified by electrolysis.'] },
    { l: 4, q: `Which oxide dissolves in water to give an acidic solution?`, o: ['SO₂', 'Na₂O', 'CO', 'MgO'], a: 0, e: `SO₂ + H₂O → H₂SO₃, sulphurous acid.`, w: ['', 'Na₂O gives NaOH, an alkali.', 'CO does not react with water.', 'MgO gives a weakly alkaline solution.'] },
    { l: 4, q: `A mixture of hydrogen and air explodes when lit. Why must hydrogen be tested for purity before it is burned?`, o: ['Hydrogen mixed with air explodes', 'Hydrogen is poisonous', 'Hydrogen puts flames out', 'Pure hydrogen does not burn'], a: 0, e: `Hydrogen–air mixtures can explode, so the apparatus must first be cleared of air.`, w: ['', 'Hydrogen is not poisonous.', 'Hydrogen burns readily.', 'Pure hydrogen burns quietly. The mixture with air explodes.'] },
    { l: 5, q: `40 cm³ of air is passed over heated copper. The volume falls to 31.6 cm³. What percentage of the air was oxygen?`, o: ['21%', '79%', '8.4%', '31.6%'], a: 0, e: `Oxygen used = 40 − 31.6 = 8.4 cm³. 8.4 ÷ 40 × 100 = 21%.`, w: ['', 'That is the percentage left, mainly nitrogen.', '8.4 is the volume, not the percentage.', '31.6 is the volume left, in cm³.'] },
    { l: 5, q: `Why is hydrogen peroxide solution stored in dark bottles?`, o: ['Light speeds up its decomposition to water and oxygen', 'It reacts with glass', 'It is coloured', 'Light makes it explode'], a: 0, e: `Light provides energy that speeds up 2H₂O₂ → 2H₂O + O₂, so it would lose strength.`, w: ['', 'It does not attack glass.', 'It is colourless.', 'Dilute H₂O₂ does not explode in light. It just decomposes faster.'] }
  ]
},

/* ───────────── CHLORINE AND THE HALOGENS ───────────── */
{
  id: 'c-hal', name: 'Chlorine and the Halogens', sec: 'Section IV · The elements and the environment',
  goals: ['Prepare, dry and collect chlorine, and test for it', 'Explain how chlorine bleaches and how it is used', 'Describe hydrogen chloride and test for halide ions'],
  trap: `Chlorine is denser than air and fairly soluble, so it is collected by downward delivery, not over water.`,
  parts: [
    {
      title: 'Preparing chlorine',
      idea: `Chlorine is made by oxidising concentrated hydrochloric acid with manganese(IV) oxide or potassium permanganate. It is a dense, greenish-yellow, poisonous gas.`,
      g: ['app', { kind: 'gas', m: 'down', what: 'MnO₂ + conc. HCl' }], cap: `Chlorine is denser than air, so it fills the jar from the bottom up.`,
      rules: [
        `MnO₂ + 4HCl ${RA} MnCl₂ + Cl₂ + 2H₂O, heated.`,
        `Pass it through water to remove HCl, then concentrated H₂SO₄ to dry it. Collect by downward delivery.`,
        `Test: chlorine turns damp blue litmus red, then bleaches it white.`
      ],
      ex: {
        q: `Why is chlorine passed through water and then through concentrated sulphuric acid?`,
        steps: [
          [`The chlorine contains some HCl gas from the hot acid`, `HCl is very soluble in water.`],
          [`Water absorbs the HCl, and the chlorine leaves wet`, `Chlorine is only fairly soluble.`],
          [`Concentrated H₂SO₄ removes the water vapour`, `It is a drying agent that does not react with chlorine.`]
        ],
        why: [2, 'Why not use quicklime (CaO) to dry it?', ['CaO is a base and would react with chlorine', 'CaO is too expensive', 'CaO is not a drying agent'], ['Right. The drying agent must not react with the gas.', 'Cost is not the issue.', 'CaO is a drying agent, used for ammonia.']]
      },
      tryit: {
        q: `What role does MnO₂ play in MnO₂ + 4HCl → MnCl₂ + Cl₂ + 2H₂O?`,
        ask: `Choose its role.`, o: ['Oxidising agent', 'Reducing agent', 'Catalyst', 'Drying agent'], a: 0,
        h: `Chlorine goes from −1 in HCl to 0 in Cl₂.`, e: `HCl is oxidised to Cl₂, so MnO₂ is the oxidising agent. Mn goes from +4 to +2.`,
        fb: ['', 'MnO₂ is reduced, so it is the oxidising agent.', 'It is used up, so it is not a catalyst here.', 'It does not dry anything.']
      }
    },
    {
      title: 'Reactions and uses of chlorine, and hydrogen chloride',
      idea: `Chlorine reacts with water to form hypochlorous acid, HOCl, which bleaches by oxidation. Hydrogen chloride is a very soluble gas that forms hydrochloric acid in water.`,
      rules: [
        `Cl₂ + H₂O ${EQM} HCl + HOCl. Then HOCl ${RA} HCl + [O], which oxidises dyes.`,
        `Uses of chlorine: treating drinking water, bleach, making PVC and HCl.`,
        `Halide test: add dilute nitric acid, then silver nitrate. Cl⁻ gives white AgCl, Br⁻ cream AgBr, I⁻ yellow AgI.`
      ],
      ex: {
        q: `Why does dry chlorine not bleach dry litmus paper, while damp chlorine does?`,
        steps: [
          [`Bleaching is done by HOCl`, `Not by Cl₂ itself.`],
          [`HOCl forms only when chlorine reacts with water`, `Cl₂ + H₂O ${EQM} HCl + HOCl.`],
          [`Dry paper has no water, so no HOCl forms`, `No bleaching.`]
        ],
        why: [0, 'Why does the litmus turn red before it turns white?', ['HCl and HOCl are acids, so it goes red, then HOCl bleaches it', 'Chlorine is red', 'Red is the first stage of rust'], ['Right.', 'Chlorine is greenish-yellow.', 'Rust has nothing to do with it.']]
      },
      tryit: {
        q: `Silver nitrate solution is added to a solution acidified with nitric acid. A yellow precipitate forms. Which ion is present?`,
        ask: `Choose the ion.`, o: ['I⁻', 'Cl⁻', 'Br⁻', 'SO₄²⁻'], a: 0,
        h: `Chloride white, bromide cream, iodide yellow.`, e: `Silver iodide, AgI, is yellow.`,
        fb: ['', 'AgCl is white.', 'AgBr is cream.', 'Sulphate is tested with barium chloride.']
      }
    }
  ],
  spot: { part: 0, who: 'Obinna', q: `How should chlorine be collected in the laboratory?`, lines: ['Chlorine is a gas', 'Collect it over water, like oxygen', 'Use a gas jar with a lid'], bad: 1,
    okfb: ['Correct.', 'A lid stops it escaping. Fine.'],
    o: ['Chlorine dissolves in water and is denser than air: use downward delivery', 'Use upward delivery', 'Collect it in an open beaker', 'Nothing is wrong'],
    fb: ['That is it.', 'Upward delivery is for gases lighter than air.', 'It is poisonous and would escape.', 'Collecting over water loses much of the chlorine.'],
    h: ['Is chlorine soluble in water? Is it heavier than air?'], fix: 'Collect chlorine by downward delivery into a jar, in a fume cupboard.' },
  qs: [
    { l: 1, q: `What colour is chlorine gas?`, o: ['Greenish-yellow', 'Brown', 'Colourless', 'Purple'], a: 0, e: `Chlorine is a greenish-yellow gas.`, w: ['', 'Brown is NO₂ or bromine vapour.', 'HCl and most gases are colourless, but chlorine is not.', 'Purple is iodine vapour.'] },
    { l: 1, q: `Chlorine is added to drinking water to`, o: ['kill bacteria', 'make it hard', 'add taste', 'remove salt'], a: 0, e: `Chlorine kills harmful micro-organisms.`, w: ['', 'It does not cause hardness.', 'It is not added for taste.', 'It does not remove dissolved salt.'] },
    { l: 2, dx: 1, q: `Which substance bleaches in damp chlorine?`, o: ['HOCl', 'Cl₂', 'HCl', 'H₂O'], a: 0, e: `Hypochlorous acid, HOCl, releases oxygen that oxidises dyes.`, w: ['', 'Dry Cl₂ does not bleach.', 'HCl turns litmus red but does not bleach it.', 'Water alone does not bleach.'] },
    { l: 2, q: `Chlorine is dried with`, o: ['concentrated sulphuric acid', 'quicklime', 'calcium chloride and lime', 'sodium hydroxide'], a: 0, e: `Conc. H₂SO₄ removes water and does not react with chlorine.`, w: ['', 'Quicklime is basic and reacts with chlorine.', 'Lime would react with chlorine.', 'NaOH reacts with chlorine.'] },
    { l: 2, q: `White fumes form when hydrogen chloride meets`, o: ['ammonia', 'oxygen', 'nitrogen', 'chlorine'], a: 0, e: `NH₃ + HCl → NH₄Cl, a white solid smoke.`, w: ['', 'No reaction with oxygen.', 'No reaction with nitrogen.', 'No reaction with chlorine.'] },
    { l: 3, q: `Why is hydrogen chloride used in the "fountain experiment"?`, o: ['It is extremely soluble in water', 'It is lighter than air', 'It is coloured', 'It is a strong oxidising agent'], a: 0, e: `The gas dissolves so quickly that water rushes up into the flask.`, w: ['', 'HCl is denser than air.', 'HCl is colourless.', 'Its solubility is the point.'] },
    { l: 3, q: `Which halide gives a cream precipitate with acidified silver nitrate?`, o: ['Bromide', 'Chloride', 'Iodide', 'Fluoride'], a: 0, e: `AgBr is cream.`, w: ['', 'AgCl is white.', 'AgI is yellow.', 'AgF is soluble: no precipitate.'] },
    { l: 3, q: `Hydrogen chloride is prepared in the lab from sodium chloride and`, o: ['concentrated sulphuric acid', 'dilute nitric acid', 'water', 'sodium hydroxide'], a: 0, e: `NaCl + H₂SO₄ → NaHSO₄ + HCl.`, w: ['', 'Dilute nitric acid does not give HCl gas.', 'NaCl just dissolves in water.', 'NaOH does not react with NaCl.'] },
    { l: 4, q: `What is the oxidation number of chlorine in HOCl?`, o: ['+1', '−1', '0', '+7'], a: 0, e: `H +1, O −2, so Cl = +1.`, w: ['', '−1 is chlorine in HCl.', '0 is chlorine in Cl₂.', '+7 is chlorine in perchlorates.'] },
    { l: 4, q: `Why is nitric acid added before silver nitrate in the test for halides?`, o: ['To remove carbonate ions, which would also give a precipitate', 'To dissolve the silver', 'To colour the precipitate', 'To make the halide react faster'], a: 0, e: `Carbonates would form Ag₂CO₃. The acid destroys them first.`, w: ['', 'Silver nitrate is already in solution.', 'It does not colour anything.', 'The point is to remove other ions.'] },
    { l: 5, q: `What volume of chlorine at s.t.p. is made from 8.7 g of MnO₂ with excess conc. HCl? (MnO₂ = 87)`, o: ['2.24 dm³', '8.96 dm³', '22.4 dm³', '1.12 dm³'], a: 0, e: `8.7 ÷ 87 = 0.1 mol MnO₂, giving 0.1 mol Cl₂ = 2.24 dm³.`, w: ['', 'You multiplied by 4. The ratio MnO₂ : Cl₂ is 1 : 1.', 'That is one mole.', 'That is 0.05 mol.'] },
    { l: 5, q: `Bleaching by chlorine is described as bleaching by`, o: ['oxidation', 'reduction', 'neutralisation', 'dehydration'], a: 0, e: `HOCl gives oxygen that oxidises the dye. Sulphur dioxide, in contrast, bleaches by reduction.`, w: ['', 'SO₂ bleaches by reduction.', 'No acid–base reaction bleaches the dye.', 'Dehydration is what conc. H₂SO₄ does to sugar.'] }
  ]
},

/* ───────────── NITROGEN, SULPHUR AND CARBON ───────────── */
{
  id: 'c-nsc', name: 'Nitrogen, Sulphur and Carbon', sec: 'Section IV · The elements and the environment',
  goals: ['Prepare and test ammonia, and describe nitric acid', 'Describe sulphur dioxide and the properties of sulphuric acid', 'Compare diamond and graphite, and the oxides of carbon'],
  trap: `Ammonia is dried with quicklime, CaO. Concentrated sulphuric acid and calcium chloride both react with ammonia, so they cannot be used.`,
  parts: [
    {
      title: 'Nitrogen and ammonia',
      idea: `Ammonia is made in the lab by heating an ammonium salt with a base. It is the only common alkaline gas.`,
      g: ['app', { kind: 'gas', m: 'up', what: 'NH₄Cl + Ca(OH)₂' }], cap: `Ammonia is lighter than air and very soluble, so it is collected by upward delivery.`,
      rules: [
        `2NH₄Cl + Ca(OH)₂ ${RA} CaCl₂ + 2H₂O + 2NH₃, heated. Dry it with quicklime.`,
        `Test: ammonia turns damp red litmus blue and gives white fumes with HCl.`,
        `Ammonia is oxidised to nitric acid (Ostwald process, platinum catalyst). Ammonium salts and nitrates are fertilisers.`
      ],
      ex: {
        q: `Why is ammonia collected by upward delivery and not over water?`,
        steps: [
          [`Ammonia is extremely soluble in water`, `Most of it would dissolve.`],
          [`Ammonia (M<sub>r</sub> 17) is lighter than air (average about 29)`, `So it rises.`],
          [`An upside-down jar traps it`, `Upward delivery.`]
        ],
        why: [1, 'How do you know ammonia is lighter than air?', ['Its relative molecular mass, 17, is less than air\'s average of about 29', 'Because it smells', 'Because it is a base'], ['Right.', 'Smell does not tell you density.', 'Being a base is about its chemistry, not its density.']]
      },
      tryit: {
        q: `Which drying agent is used for ammonia?`,
        ask: `Choose the drying agent.`, o: ['Quicklime (CaO)', 'Concentrated sulphuric acid', 'Anhydrous calcium chloride', 'Phosphorus(V) oxide'], a: 0,
        h: `Ammonia is a base, so the drying agent must not be acidic.`, e: `CaO is basic, so it does not react with ammonia.`,
        fb: ['', 'Sulphuric acid would react to form ammonium sulphate.', 'Calcium chloride forms a compound with ammonia.', 'P₄O₁₀ is acidic and reacts with ammonia.']
      }
    },
    {
      title: 'Sulphur, sulphur dioxide and sulphuric acid',
      idea: `Sulphur burns to give sulphur dioxide, a choking acidic gas. Most sulphur dioxide is turned into sulphuric acid by the Contact process. Concentrated sulphuric acid is a strong dehydrating agent.`,
      rules: [
        `SO₂ is a reducing agent: it turns acidified potassium dichromate(VI) from orange to green. It bleaches by reduction.`,
        `Concentrated H₂SO₄ dehydrates sugar to carbon: C₁₂H₂₂O₁₁ ${RA} 12C + 11H₂O. It is also a drying agent.`,
        `To dilute concentrated acid, always add the acid slowly to water, never water to the acid.`
      ],
      ex: {
        q: `Concentrated sulphuric acid is added to sugar. A black, spongy mass forms and it gets very hot. Explain.`,
        steps: [
          [`The acid removes hydrogen and oxygen as water`, `It is a dehydrating agent.`],
          [`Carbon is left behind`, `That is the black solid.`],
          [`The reaction is very exothermic`, `Steam puffs the carbon up into a sponge.`]
        ],
        why: [0, 'How is dehydrating different from drying?', ['Dehydrating removes H and O from inside a compound; drying removes water that is already there', 'There is no difference', 'Drying is faster'], ['Right. Sugar has no water in it until the acid pulls it out.', 'They are different: sugar contains no water molecules.', 'Speed is not the difference.']]
      },
      tryit: {
        q: `Which test shows that a gas is sulphur dioxide?`,
        ask: `Choose the test.`, o: ['It turns acidified potassium dichromate(VI) from orange to green', 'It relights a glowing splint', 'It turns limewater milky only', 'It burns with a pop'], a: 0,
        h: `SO₂ is a reducing agent.`, e: `SO₂ reduces orange Cr₂O₇²⁻ to green Cr³⁺.`,
        fb: ['', 'That is the oxygen test.', 'SO₂ also turns limewater milky, so this test alone cannot tell it from CO₂.', 'That is the hydrogen test.']
      }
    },
    {
      title: 'Carbon and its oxides',
      idea: `Carbon exists as diamond and graphite, which are allotropes: different forms of the same element. The differences come from how the atoms are bonded.`,
      rules: [
        `Diamond: each C joined to 4 others in a giant network. Very hard, does not conduct.`,
        `Graphite: layers of hexagons, each C joined to 3 others, with free electrons between layers. Soft, slippery, conducts.`,
        `CO₂: made from CaCO₃ + 2HCl. Turns limewater milky. CO: poisonous, combines with haemoglobin, used as a reducing agent.`
      ],
      ex: {
        q: `Explain why graphite conducts electricity but diamond does not.`,
        steps: [
          [`In graphite each carbon uses 3 of its 4 outer electrons in bonds`, `The fourth electron is delocalised.`],
          [`These free electrons can move along the layers`, `So a current can flow.`],
          [`In diamond all 4 electrons are used in bonds`, `No free electrons, so no conduction.`]
        ],
        why: [1, 'Why do free electrons make it conduct?', ['A current is a flow of charge, and free electrons can carry it', 'Electrons make graphite softer', 'Free electrons are positive'], ['Right. Metals conduct the same way.', 'Softness comes from layers sliding, not from conduction.', 'Electrons are negative.']]
      },
      tryit: {
        q: `Why is graphite used as a lubricant?`,
        ask: `Choose the reason.`, o: ['Its layers are held weakly and slide over each other', 'It has free electrons', 'It is very hard', 'It has a high melting point'], a: 0,
        h: `Think about the layers.`, e: `Only weak forces hold the layers together, so they slide easily.`,
        fb: ['', 'Free electrons explain conduction, not slipperiness.', 'Graphite is soft. Diamond is hard.', 'A high melting point lets it work when hot, but the sliding layers are the reason it lubricates.']
      }
    }
  ],
  spot: { part: 0, who: 'Hauwa', q: `How would you dry ammonia gas?`, lines: ['Ammonia is made by heating NH₄Cl with Ca(OH)₂', 'Pass it through concentrated sulphuric acid', 'Collect it by upward delivery'], bad: 1,
    okfb: ['That is the right preparation.', 'Upward delivery is right.'],
    o: ['Sulphuric acid reacts with ammonia. Use quicklime', 'Pass it through water', 'Use calcium chloride', 'Nothing is wrong'],
    fb: ['That is it.', 'Ammonia dissolves in water.', 'Calcium chloride also reacts with ammonia.', '2NH₃ + H₂SO₄ → (NH₄)₂SO₄. The ammonia would be lost.'],
    h: ['Ammonia is a base. What happens when a base meets an acid?'], fix: 'Dry ammonia with quicklime, CaO.' },
  qs: [
    { l: 1, q: `Which gas turns damp red litmus paper blue?`, o: ['Ammonia', 'Chlorine', 'Carbon dioxide', 'Hydrogen chloride'], a: 0, e: `Ammonia is alkaline.`, w: ['', 'Chlorine turns litmus red and bleaches it.', 'CO₂ is weakly acidic.', 'HCl is acidic.'] },
    { l: 1, q: `Diamond and graphite are`, o: ['allotropes of carbon', 'isotopes of carbon', 'compounds of carbon', 'isomers'], a: 0, e: `They are different structural forms of the same element.`, w: ['', 'Isotopes differ in neutrons, not structure.', 'Both are pure carbon.', 'Isomers are compounds with the same formula.'] },
    { l: 2, dx: 1, q: `Carbon dioxide is identified because it`, o: ['turns limewater milky', 'relights a glowing splint', 'bleaches damp litmus', 'burns with a pop'], a: 0, e: `CO₂ + Ca(OH)₂ → CaCO₃ + H₂O. The white CaCO₃ makes it milky.`, w: ['', 'That is oxygen.', 'That is chlorine.', 'That is hydrogen.'] },
    { l: 2, q: `Carbon monoxide is poisonous because it`, o: ['combines with haemoglobin and stops it carrying oxygen', 'is acidic', 'burns the lungs', 'has a strong smell'], a: 0, e: `CO binds strongly to haemoglobin, so less oxygen reaches the body.`, w: ['', 'CO is a neutral oxide.', 'It does not burn tissue.', 'CO has no smell, which makes it dangerous.'] },
    { l: 2, q: `When diluting concentrated sulphuric acid, you should`, o: ['add the acid slowly to water', 'add water quickly to the acid', 'add water slowly to the acid', 'heat the acid first'], a: 0, e: `So much heat is given out that water added to the acid can boil and spit acid.`, w: ['', 'Never add water to the acid.', 'Even slowly, water on acid can boil and spit.', 'Heating makes it more dangerous.'] },
    { l: 3, q: `Which property of sulphur dioxide is shown when it turns orange dichromate green?`, o: ['It is a reducing agent', 'It is an oxidising agent', 'It is an acid', 'It is a dehydrating agent'], a: 0, e: `SO₂ reduces Cr(VI) to Cr(III).`, w: ['', 'The dichromate is the oxidising agent.', 'The colour change shows redox, not acidity.', 'Dehydration is not involved.'] },
    { l: 3, q: `In the Ostwald process, ammonia is converted to`, o: ['nitric acid', 'sulphuric acid', 'urea', 'ammonium chloride'], a: 0, e: `NH₃ is oxidised to NO with a platinum catalyst, then to NO₂, which with water and oxygen gives HNO₃.`, w: ['', 'Sulphuric acid comes from the Contact process.', 'Urea is made from NH₃ and CO₂.', 'NH₄Cl is made from NH₃ and HCl.'] },
    { l: 3, q: `Which is a good conductor of electricity?`, o: ['Graphite', 'Diamond', 'Sulphur', 'Iodine'], a: 0, e: `Graphite has delocalised electrons between its layers.`, w: ['', 'Diamond has no free electrons.', 'Sulphur is an insulator.', 'Iodine is a molecular solid and does not conduct.'] },
    { l: 4, q: `What mass of ammonia is made from 10.7 g of ammonium chloride with excess calcium hydroxide? (NH₄Cl = 53.5, NH₃ = 17)`, o: ['3.4 g', '1.7 g', '6.8 g', '10.7 g'], a: 0, e: `10.7 ÷ 53.5 = 0.2 mol NH₄Cl, giving 0.2 mol NH₃ = 3.4 g.`, w: ['', 'That is 0.1 mol.', 'The ratio is 2 NH₄Cl : 2 NH₃, which is 1 : 1.', 'Mass is not equal across the equation.'] },
    { l: 4, q: `Concentrated nitric acid is stored in brown bottles because`, o: ['light decomposes it to brown NO₂', 'it reacts with clear glass', 'it is a strong reducing agent', 'it absorbs water from the air'], a: 0, e: `4HNO₃ → 4NO₂ + O₂ + 2H₂O in light. The NO₂ turns it yellow.`, w: ['', 'It does not attack glass.', 'It is an oxidising agent.', 'The colour of the bottle is about light.'] },
    { l: 5, q: `Why does diamond have such a high melting point?`, o: ['Every atom is held by strong covalent bonds in a giant network', 'It has strong forces between small molecules', 'It is ionic', 'It has delocalised electrons'], a: 0, e: `Melting would mean breaking a huge number of strong covalent bonds.`, w: ['', 'Diamond is not made of separate molecules.', 'Diamond is pure carbon, so it cannot be ionic.', 'Diamond has no delocalised electrons.'] },
    { l: 5, q: `Hot concentrated sulphuric acid reacts with copper: Cu + 2H₂SO₄ → CuSO₄ + SO₂ + 2H₂O. In this reaction the acid acts as`, o: ['an oxidising agent', 'a dehydrating agent', 'a drying agent', 'a base'], a: 0, e: `Copper goes from 0 to +2, and sulphur from +6 to +4 in SO₂.`, w: ['', 'No water is removed from a compound.', 'It is not removing moisture.', 'It is an acid, not a base.'] }
  ]
},

/* ───────────── METALS AND THEIR COMPOUNDS ───────────── */
{
  id: 'c-metal', name: 'Metals and their Compounds', sec: 'Section IV · The elements and the environment',
  goals: ['Use the reactivity series to predict reactions and extraction methods', 'Describe the extraction of iron and aluminium', 'Explain how rusting is prevented, and the uses of alloys'],
  trap: `The method of extraction depends on reactivity: the most reactive metals (K to Al) need electrolysis, because carbon cannot pull oxygen from them.`,
  parts: [
    {
      title: 'The reactivity series and extraction',
      idea: `The more reactive a metal, the more firmly it holds on to oxygen in its compounds, and the harder it is to extract. A more reactive metal pushes a less reactive one out of its compounds.`,
      g: ['series', {}], cap: `Carbon sits between aluminium and zinc. It can reduce the oxides of the metals below it.`,
      rules: [
        `K, Na, Ca, Mg, Al: electrolysis of the molten compound. Zn, Fe, Sn, Pb: reduce the oxide with carbon or carbon monoxide.`,
        `Displacement: Fe + CuSO₄ ${RA} FeSO₄ + Cu, because iron is above copper.`,
        `Metals above hydrogen react with dilute acids to give hydrogen. Copper, silver and gold do not.`
      ],
      ex: {
        q: `Will magnesium react with zinc sulphate solution? Give the equation if it does.`,
        steps: [
          [`Magnesium is above zinc in the series`, `So it is more reactive.`],
          [`It displaces zinc: Mg + ZnSO₄ ${RA} MgSO₄ + Zn`, `Grey zinc forms on the magnesium.`],
          [`Magnesium is oxidised, zinc ions are reduced`, `It is a redox reaction.`]
        ],
        why: [0, 'Why does position in the series decide it?', ['A more reactive metal loses electrons more readily, so it gives them to the less reactive metal\'s ions', 'Heavier metals are pushed out', 'Displacement always happens'], ['Right.', 'Mass has nothing to do with it.', 'Copper cannot displace zinc.']]
      },
      tryit: {
        q: `Which metal must be extracted by electrolysis?`,
        ask: `Choose the metal.`, o: ['Aluminium', 'Iron', 'Zinc', 'Lead'], a: 0,
        h: `Which one is above carbon in the series?`, e: `Aluminium is above carbon, so carbon cannot reduce its oxide.`,
        fb: ['', 'Iron is below carbon: reduced in the blast furnace.', 'Zinc is below carbon: reduced with carbon.', 'Lead is below carbon: reduced with carbon.']
      }
    },
    {
      title: 'Iron, aluminium and alloys',
      idea: `Iron is extracted from haematite in the blast furnace, using coke and limestone. Aluminium is extracted from bauxite by electrolysis. Most metals are used as alloys, which are harder and stronger.`,
      rules: [
        `Blast furnace: C + O₂ ${RA} CO₂; CO₂ + C ${RA} 2CO; Fe₂O₃ + 3CO ${RA} 2Fe + 3CO₂. Limestone removes sand as slag: CaO + SiO₂ ${RA} CaSiO₃.`,
        `Aluminium: alumina is dissolved in molten cryolite to lower the melting point, then electrolysed. The carbon anodes burn away and must be replaced.`,
        `Alloys: brass (Cu, Zn), bronze (Cu, Sn), steel (Fe, C), duralumin (Al, Cu, Mg), solder (Pb, Sn).`
      ],
      ex: {
        q: `Why is limestone added to the blast furnace?`,
        steps: [
          [`CaCO₃ ${RA} CaO + CO₂`, `The heat decomposes it to quicklime.`],
          [`CaO + SiO₂ ${RA} CaSiO₃`, `The basic oxide reacts with the acidic sand impurity.`],
          [`The slag floats on the molten iron and is tapped off`, `So the sand is removed.`]
        ],
        why: [1, 'Why does CaO react with SiO₂?', ['CaO is a basic oxide and SiO₂ is an acidic oxide', 'They are both metals', 'They have the same formula mass'], ['Right. A basic oxide and an acidic oxide form a salt.', 'Silicon is not a metal.', 'Formula mass has nothing to do with it.']]
      },
      tryit: {
        q: `Why is aluminium oxide dissolved in cryolite before electrolysis?`,
        ask: `Choose the reason.`, o: ['To lower the working temperature and save energy', 'To make the aluminium purer', 'To stop the anodes burning', 'To make the oxide react with carbon'], a: 0,
        h: `Pure alumina melts at over 2000 °C.`, e: `Dissolved in cryolite it can be electrolysed at about 950 °C, which saves a lot of energy.`,
        fb: ['', 'Purity is not the main reason.', 'The anodes still burn away in the oxygen.', 'Carbon cannot reduce alumina at all.']
      }
    },
    {
      title: 'Rusting and its prevention',
      idea: `Rust is hydrated iron(III) oxide. Iron rusts when both water and oxygen are present, and salt makes it faster. Rusting can be stopped by keeping them out, or by sacrificial protection.`,
      rules: [
        `Barriers: paint, oil, grease, plastic coating, tin plating.`,
        `Galvanising: coating with zinc. Zinc is more reactive, so it corrodes instead of the iron, even if scratched.`,
        `Sacrificial protection: blocks of magnesium or zinc attached to ships and pipes corrode instead of the iron.`
      ],
      ex: {
        q: `A tin-plated can and a galvanised bucket are both scratched. Which rusts faster, and why?`,
        steps: [
          [`Tin is below iron in the series. Zinc is above iron`, `Compare reactivities.`],
          [`On the scratched can, iron is more reactive than tin, so the iron corrodes`, `It even rusts faster than bare iron.`],
          [`On the bucket, zinc corrodes instead of the iron`, `So the tin can rusts faster.`]
        ],
        why: [2, 'Why does the zinc corrode instead of the iron?', ['Zinc is more reactive, so it loses electrons first', 'Zinc is a stronger metal', 'Zinc stops water reaching the iron at the scratch'], ['Right. That is sacrificial protection.', 'Strength is not the reason.', 'At the scratch the iron is exposed. Zinc protects it by reacting first.']]
      },
      tryit: {
        q: `Which method protects iron even when the coating is scratched?`,
        ask: `Choose the method.`, o: ['Galvanising with zinc', 'Painting', 'Tin plating', 'Oiling'], a: 0,
        h: `Only one coating is more reactive than iron.`, e: `Zinc is more reactive than iron, so it corrodes first, protecting the iron.`,
        fb: ['', 'Once paint is scratched, the iron is exposed.', 'Tin is less reactive, so scratched tin plate rusts faster.', 'Oil is easily wiped off.']
      }
    }
  ],
  spot: { part: 1, who: 'Daniel', q: `Describe how iron(III) oxide is reduced in the blast furnace.`, lines: ['Coke burns to give carbon dioxide', 'The carbon dioxide reduces the iron(III) oxide to iron', 'Molten iron collects at the bottom'], bad: 1,
    okfb: ['Right: C + O₂ → CO₂.', 'Right: the iron is denser and sinks.'],
    o: ['CO₂ is first reduced by more coke to CO, and the CO reduces the iron oxide', 'Limestone reduces the iron oxide', 'Oxygen reduces the iron oxide', 'Nothing is wrong'],
    fb: ['That is it.', 'Limestone removes the sand.', 'Oxygen would oxidise, not reduce.', 'CO₂ cannot take oxygen from iron oxide.'],
    h: ['Which oxide of carbon can still take more oxygen?'], fix: 'CO₂ + C → 2CO, then Fe₂O₃ + 3CO → 2Fe + 3CO₂.' },
  qs: [
    { l: 1, q: `Which metal is the most reactive?`, o: ['Potassium', 'Iron', 'Copper', 'Gold'], a: 0, e: `Potassium is at the top of the reactivity series.`, w: ['', 'Iron is in the middle.', 'Copper is near the bottom.', 'Gold is the least reactive.'] },
    { l: 1, q: `Brass is an alloy of copper and`, o: ['zinc', 'tin', 'iron', 'lead'], a: 0, e: `Brass is copper and zinc.`, w: ['', 'Copper and tin make bronze.', 'Iron and carbon make steel.', 'Lead and tin make solder.'] },
    { l: 2, dx: 1, q: `Which reaction takes place?`, o: ['Zn + CuSO₄ → ZnSO₄ + Cu', 'Cu + ZnSO₄ → CuSO₄ + Zn', 'Cu + FeSO₄ → CuSO₄ + Fe', 'Ag + CuSO₄ → Ag₂SO₄ + Cu'], a: 0, e: `Zinc is above copper, so it displaces copper.`, w: ['', 'Copper is less reactive than zinc.', 'Copper is less reactive than iron.', 'Silver is less reactive than copper.'] },
    { l: 2, q: `The main ore of aluminium is`, o: ['bauxite', 'haematite', 'galena', 'limestone'], a: 0, e: `Bauxite is impure aluminium oxide.`, w: ['', 'Haematite is iron(III) oxide.', 'Galena is lead sulphide.', 'Limestone is calcium carbonate.'] },
    { l: 2, q: `What is the reducing agent in the blast furnace?`, o: ['Carbon monoxide', 'Limestone', 'Oxygen', 'Slag'], a: 0, e: `CO takes oxygen from Fe₂O₃.`, w: ['', 'Limestone removes sand.', 'Oxygen burns the coke.', 'Slag is a waste product.'] },
    { l: 3, q: `Why do the carbon anodes need replacing in aluminium extraction?`, o: ['Oxygen formed at the anode burns them to CO₂', 'Aluminium dissolves them', 'Cryolite attacks them', 'They melt'], a: 0, e: `C + O₂ → CO₂ at the high temperature.`, w: ['', 'Aluminium forms at the cathode.', 'Cryolite is the solvent.', 'Carbon does not melt at 950 °C.'] },
    { l: 3, q: `Which metal does not react with dilute hydrochloric acid?`, o: ['Copper', 'Zinc', 'Magnesium', 'Iron'], a: 0, e: `Copper is below hydrogen in the series.`, w: ['', 'Zinc gives hydrogen with dilute acid.', 'Magnesium reacts vigorously.', 'Iron reacts slowly to give hydrogen.'] },
    { l: 3, q: `Steel is made from iron by`, o: ['removing most of the carbon and adding controlled amounts of other elements', 'adding more carbon', 'coating it with zinc', 'melting it with sand'], a: 0, e: `Blast furnace iron has too much carbon, which makes it brittle.`, w: ['', 'Too much carbon makes iron brittle.', 'That is galvanising.', 'Sand would add impurities.'] },
    { l: 4, q: `What is formed when sodium nitrate is heated strongly?`, o: ['Sodium nitrite and oxygen', 'Sodium oxide, NO₂ and oxygen', 'Sodium, NO₂ and oxygen', 'No change'], a: 0, e: `2NaNO₃ → 2NaNO₂ + O₂. Nitrates of K and Na give the nitrite and oxygen.`, w: ['', 'Most other nitrates give the oxide, NO₂ and O₂.', 'Only silver and mercury nitrates give the metal.', 'It does decompose.'] },
    { l: 4, q: `Which property of transition metals makes them useful as catalysts?`, o: ['They have variable oxidation states', 'They are very soft', 'They have low melting points', 'They are all magnetic'], a: 0, e: `Changing oxidation state lets them pass electrons in reactions.`, w: ['', 'Transition metals are mostly hard.', 'Most have high melting points.', 'Only a few, like iron, nickel and cobalt, are magnetic.'] },
    { l: 5, q: `What mass of iron can be made from 320 kg of Fe₂O₃? (Fe = 56, O = 16)`, o: ['224 kg', '112 kg', '160 kg', '448 kg'], a: 0, e: `M(Fe₂O₃) = 160. 320 kg is 2 kmol, giving 4 kmol of Fe = 224 kg.`, w: ['', 'Each Fe₂O₃ gives 2 Fe atoms, not 1.', '160 kg is half the oxide, not the iron.', 'You doubled twice.'] },
    { l: 5, q: `Why is aluminium resistant to corrosion even though it is quite reactive?`, o: ['A thin layer of aluminium oxide protects it', 'It is below hydrogen', 'It is an alloy', 'It does not react with oxygen'], a: 0, e: `The oxide layer forms at once and seals the surface.`, w: ['', 'Aluminium is above hydrogen.', 'Pure aluminium has this layer too.', 'It reacts at once with oxygen, which forms the protective layer.'] }
  ]
},

/* ───────────── POLLUTION AND CHEMICAL INDUSTRY ───────────── */
{
  id: 'c-env', name: 'Pollution and Chemical Industry', sec: 'Section IV · The elements and the environment',
  goals: ['Name the main air, water and land pollutants and their effects', 'Explain acid rain, the greenhouse effect and ozone depletion', 'Describe how cement, glass and other chemicals are made'],
  trap: `Acid rain comes from SO₂ and nitrogen oxides. The greenhouse effect comes from CO₂ and methane. Ozone depletion comes from CFCs. Keep each cause with its own effect.`,
  parts: [
    {
      title: 'Pollution',
      idea: `Pollutants are substances that harm living things or the environment. Burning fuels is the biggest source of air pollution, and runoff, sewage and oil spills pollute water.`,
      rules: [
        `SO₂ and NO₂ dissolve in rain to form acid rain, which damages buildings, plants and lakes.`,
        `CO₂ and CH₄ trap heat (the greenhouse effect). CFCs break down the ozone layer, which shields us from ultraviolet light.`,
        `Fertilisers washed into lakes cause eutrophication: algae grow, die and decay, using up the oxygen.`
      ],
      ex: {
        q: `Explain how burning coal that contains sulphur can damage limestone buildings.`,
        steps: [
          [`S + O₂ ${RA} SO₂`, `The sulphur in the coal burns.`],
          [`SO₂ dissolves in rainwater to form acids`, `This is acid rain.`],
          [`The acid reacts with limestone: CaCO₃ + H₂SO₄ ${RA} CaSO₄ + H₂O + CO₂`, `The stone slowly wears away.`]
        ],
        why: [2, 'Why is limestone attacked?', ['Calcium carbonate reacts with acids', 'Limestone dissolves in pure water', 'SO₂ is a strong base'], ['Right.', 'Limestone is almost insoluble in pure water.', 'SO₂ is an acidic oxide.']]
      },
      tryit: {
        q: `Which pollutant causes depletion of the ozone layer?`,
        ask: `Choose the pollutant.`, o: ['CFCs', 'Carbon dioxide', 'Sulphur dioxide', 'Lead compounds'], a: 0,
        h: `It was used in old fridges and aerosols.`, e: `Chlorofluorocarbons release chlorine atoms high up, which break down ozone.`,
        fb: ['', 'CO₂ causes the greenhouse effect.', 'SO₂ causes acid rain.', 'Lead causes poisoning, not ozone depletion.']
      }
    },
    {
      title: 'The chemical industry',
      idea: `The chemical industry turns raw materials such as crude oil, natural gas, limestone and air into useful products. Nigeria has refineries and petrochemical plants, fertiliser plants and cement works.`,
      rules: [
        `Cement: limestone and clay heated in a kiln. Glass: sand, sodium carbonate and limestone melted together.`,
        `Crude oil is refined into fuels and feedstock for plastics. Natural gas is used to make fertilisers.`,
        `A good site has raw materials, energy, water, transport, workers and a market nearby.`
      ],
      ex: {
        q: `Name the three main raw materials for making ordinary glass.`,
        steps: [
          [`Sand: silicon dioxide, SiO₂`, `The main ingredient.`],
          [`Sodium carbonate (soda ash)`, `Lowers the melting point.`],
          [`Limestone, CaCO₃`, `Makes the glass insoluble in water.`]
        ],
        why: [1, 'Why add sodium carbonate?', ['It lowers the temperature needed to melt the sand', 'It colours the glass', 'It makes the glass stronger than steel'], ['Right. Sand alone melts at over 1700 °C.', 'Colours come from metal oxides.', 'That is not its purpose.']]
      },
      tryit: {
        q: `Which raw materials are used to make cement?`,
        ask: `Choose the pair.`, o: ['Limestone and clay', 'Sand and salt', 'Iron ore and coke', 'Crude oil and water'], a: 0,
        h: `It is made in a kiln and contains calcium silicates.`, e: `Limestone and clay are heated strongly in a rotary kiln.`,
        fb: ['', 'Sand is used for glass. Salt is not used for cement.', 'These are used for iron.', 'Crude oil is used for fuels and plastics.']
      }
    }
  ],
  spot: { part: 0, who: 'Tolu', q: `Explain why carbon dioxide is a problem for the environment.`, lines: ['Burning fossil fuels releases carbon dioxide', 'Carbon dioxide destroys the ozone layer', 'So more harmful UV light reaches the Earth'], bad: 1,
    okfb: ['Right.', 'This would follow if line 2 were true. It is the effect of CFCs.'],
    o: ['CO₂ traps heat and causes the greenhouse effect. CFCs damage the ozone layer', 'Carbon dioxide causes acid rain', 'Carbon dioxide is poisonous', 'Nothing is wrong'],
    fb: ['That is it.', 'CO₂ makes rain slightly acidic, but acid rain is mainly from SO₂ and NO₂.', 'CO₂ is not poisonous at normal levels.', 'The ozone layer is damaged by CFCs, not by CO₂.'],
    h: ['Which pollutant attacks the ozone layer?'], fix: 'CO₂ is a greenhouse gas: it traps heat and contributes to global warming.' },
  qs: [
    { l: 1, q: `Which gas is the main cause of acid rain?`, o: ['Sulphur dioxide', 'Carbon monoxide', 'Oxygen', 'Nitrogen'], a: 0, e: `SO₂ dissolves in rain to form acids. Nitrogen oxides also contribute.`, w: ['', 'CO is poisonous but not a cause of acid rain.', 'Oxygen is not a pollutant.', 'Nitrogen gas is unreactive. Its oxides contribute.'] },
    { l: 1, q: `Which gas is a greenhouse gas?`, o: ['Methane', 'Nitrogen', 'Oxygen', 'Argon'], a: 0, e: `Methane and carbon dioxide trap heat in the atmosphere.`, w: ['', 'Nitrogen does not trap heat.', 'Oxygen does not trap heat.', 'Argon does not trap heat.'] },
    { l: 2, dx: 1, q: `Eutrophication of lakes is caused mainly by`, o: ['fertilisers washed in from farms', 'acid rain', 'CFCs', 'carbon monoxide'], a: 0, e: `Nitrates and phosphates feed algae, which then die and use up the oxygen as they decay.`, w: ['', 'Acid rain harms lakes in a different way.', 'CFCs affect the ozone layer.', 'CO does not get into lakes in this way.'] },
    { l: 2, q: `The ozone layer protects the Earth from`, o: ['ultraviolet radiation', 'acid rain', 'carbon dioxide', 'meteors'], a: 0, e: `Ozone absorbs much of the Sun's harmful UV light.`, w: ['', 'Ozone does not stop rain.', 'Ozone does not absorb CO₂.', 'Meteors burn up for other reasons.'] },
    { l: 2, q: `Which raw materials are used to make glass?`, o: ['Sand, sodium carbonate and limestone', 'Clay and limestone', 'Iron ore and coke', 'Bauxite and cryolite'], a: 0, e: `They are melted together at about 1500 °C.`, w: ['', 'Clay and limestone make cement.', 'These make iron.', 'These make aluminium.'] },
    { l: 3, q: `Which pollutant comes mainly from the incomplete combustion of fuels?`, o: ['Carbon monoxide', 'Sulphur dioxide', 'CFCs', 'Nitrates'], a: 0, e: `When there is not enough oxygen, CO forms instead of CO₂.`, w: ['', 'SO₂ comes from sulphur in the fuel.', 'CFCs come from old fridges and aerosols.', 'Nitrates come from fertilisers.'] },
    { l: 3, q: `Lead compounds were once added to petrol. Why is lead a pollutant?`, o: ['It is poisonous and harms the nervous system', 'It causes acid rain', 'It destroys ozone', 'It is a greenhouse gas'], a: 0, e: `Lead builds up in the body and damages the brain and nerves.`, w: ['', 'Acid rain comes from SO₂ and NO₂.', 'Ozone is destroyed by CFCs.', 'Lead is not a gas.'] },
    { l: 3, q: `Why are non-biodegradable plastics a problem?`, o: ['Microbes cannot break them down, so they last for centuries', 'They dissolve in rain', 'They give off oxygen', 'They are too light'], a: 0, e: `They pile up in landfill, water and drains.`, w: ['', 'Plastics do not dissolve in rain.', 'They do not give off oxygen.', 'Their weight is not the problem.'] },
    { l: 4, q: `Catalytic converters in cars change carbon monoxide and nitrogen monoxide into`, o: ['carbon dioxide and nitrogen', 'carbon and oxygen', 'sulphur dioxide and water', 'methane and ammonia'], a: 0, e: `2CO + 2NO → 2CO₂ + N₂.`, w: ['', 'Carbon is not formed.', 'There is no sulphur here.', 'These are not formed.'] },
    { l: 4, q: `Which is NOT a factor in choosing a site for a chemical plant?`, o: ['The colour of the local soil', 'Supply of raw materials', 'Good transport links', 'A source of water'], a: 0, e: `Soil colour has nothing to do with running a factory.`, w: ['', 'Raw materials are essential.', 'Products must reach markets.', 'Most plants need lots of water for cooling.'] },
    { l: 5, q: `Lime is added to lakes damaged by acid rain. Which reaction does it carry out?`, o: ['Neutralisation', 'Oxidation', 'Reduction', 'Polymerisation'], a: 0, e: `Lime is basic, so it neutralises the acid.`, w: ['', 'No oxidation is needed.', 'No reduction is needed.', 'No polymer forms.'] },
    { l: 5, q: `Why does the chemical industry recycle unreacted gases in processes like the Haber process?`, o: ['To save raw materials and reduce waste', 'To make the gases hotter', 'To change the equilibrium constant', 'Because the law requires gases to be reused'], a: 0, e: `Only some of the gas reacts in one pass, so recycling uses it all eventually.`, w: ['', 'Recycling does not heat the gas.', 'K<sub>c</sub> depends on temperature only.', 'The reason is economic and environmental.'] }
  ]
},

/* ───────────── TESTS FOR IONS AND GASES ───────────── */
{
  id: 'c-qual', name: 'Tests for Ions and Gases', sec: 'Section IV · The elements and the environment',
  goals: ['Identify common gases by their tests', 'Identify metal ions with sodium hydroxide and ammonia solution', 'Identify anions and use flame tests'],
  trap: `Zinc and aluminium both give white precipitates that dissolve in excess sodium hydroxide. To tell them apart, use ammonia: zinc hydroxide dissolves in excess ammonia, but aluminium hydroxide does not.`,
  parts: [
    {
      title: 'Tests for gases',
      idea: `Each common gas has one test that gives a clear result. Learn the test, the result and what it shows.`,
      rules: [
        `H₂: squeaky pop with a lighted splint. O₂: relights a glowing splint. CO₂: turns limewater milky.`,
        `NH₃: turns damp red litmus blue. Cl₂: bleaches damp litmus. HCl: white fumes with ammonia.`,
        `SO₂: turns acidified potassium dichromate(VI) from orange to green.`
      ],
      ex: {
        q: `A gas turns limewater milky and turns acidified potassium dichromate(VI) green. What is it?`,
        steps: [
          [`Milky limewater: CO₂ or SO₂`, `Both form insoluble calcium salts.`],
          [`Orange to green dichromate: a reducing gas`, `CO₂ does not do this.`],
          [`The gas is sulphur dioxide`, `Only SO₂ passes both tests.`]
        ],
        why: [1, 'Why is the dichromate test needed?', ['Limewater alone cannot tell SO₂ from CO₂', 'Limewater is unreliable', 'Dichromate detects CO₂'], ['Right. Two tests are needed to tell them apart.', 'Limewater is reliable, but two gases pass it.', 'Dichromate does not react with CO₂.']]
      },
      tryit: {
        q: `A gas gives white fumes with ammonia. What is it?`,
        ask: `Choose the gas.`, o: ['Hydrogen chloride', 'Carbon dioxide', 'Oxygen', 'Hydrogen'], a: 0,
        h: `The white fumes are a solid salt.`, e: `NH₃ + HCl → NH₄Cl, white fumes.`,
        fb: ['', 'CO₂ does not give fumes with ammonia.', 'Oxygen does not react with ammonia here.', 'Hydrogen does not react with ammonia.']
      }
    },
    {
      title: 'Tests for metal ions',
      idea: `Add sodium hydroxide solution a few drops at a time, then in excess. Repeat with ammonia solution. The colour of the precipitate, and whether it dissolves in excess, identifies the metal ion.`,
      g: TUBES, cap: `With a little sodium hydroxide: copper(II) blue, iron(II) green, iron(III) red-brown, zinc white.`,
      rules: [
        `Cu²⁺: blue precipitate. In excess ammonia it dissolves to a deep blue solution.`,
        `Zn²⁺: white, dissolves in excess of both. Al³⁺ and Pb²⁺: white, dissolve in excess NaOH but not in excess ammonia. Ca²⁺: white with NaOH, insoluble in excess; none with ammonia.`,
        `NH₄⁺: warm with NaOH. Ammonia is given off.`
      ],
      ex: {
        q: `A solution gives a white precipitate with NaOH that dissolves in excess. With ammonia it gives a white precipitate that also dissolves in excess. Which ion is it?`,
        steps: [
          [`White, soluble in excess NaOH: Zn²⁺, Al³⁺ or Pb²⁺`, `These hydroxides are amphoteric.`],
          [`Soluble in excess ammonia too`, `Only zinc hydroxide does this.`],
          [`The ion is Zn²⁺`, `It forms a soluble complex with ammonia.`]
        ],
        why: [1, 'Why does the ammonia test help?', ['Of the three, only zinc hydroxide dissolves in excess ammonia', 'Ammonia changes the colour', 'Ammonia is stronger than NaOH'], ['Right.', 'All three precipitates stay white.', 'Ammonia is a weaker base than NaOH.']]
      },
      tryit: {
        q: `A solution gives a red-brown precipitate with sodium hydroxide. Which ion is present?`,
        ask: `Choose the ion.`, o: ['Fe³⁺', 'Fe²⁺', 'Cu²⁺', 'Zn²⁺'], a: 0,
        h: `Rust is red-brown.`, e: `Iron(III) hydroxide is red-brown.`,
        fb: ['', 'Iron(II) hydroxide is green.', 'Copper(II) hydroxide is blue.', 'Zinc hydroxide is white.']
      }
    },
    {
      title: 'Tests for anions, and flame tests',
      idea: `Anions are identified by the precipitate or gas they give with a chosen reagent. Some metal ions also give a colour to a flame.`,
      rules: [
        `CO₃²⁻: add dilute acid, CO₂ is given off. SO₄²⁻: acidify, add barium chloride, white precipitate. Cl⁻: acidify with nitric acid, add silver nitrate, white precipitate.`,
        `NO₃⁻: add NaOH and aluminium, warm: ammonia is given off. Or the brown ring test with iron(II) sulphate and conc. H₂SO₄.`,
        `Flame tests: Na⁺ yellow, K⁺ lilac, Ca²⁺ brick-red, Cu²⁺ blue-green.`
      ],
      ex: {
        q: `A white solid gives a lilac flame, and its solution gives a white precipitate with acidified barium chloride. Name the solid.`,
        steps: [
          [`Lilac flame: K⁺`, `Potassium.`],
          [`White precipitate with acidified BaCl₂: SO₄²⁻`, `Barium sulphate.`],
          [`The solid is potassium sulphate, K₂SO₄`, `Put the two ions together.`]
        ],
        why: [1, 'Why acidify before adding barium chloride?', ['To remove carbonate, which would also give a white precipitate', 'To make the barium dissolve', 'To change the colour of the flame'], ['Right. BaCO₃ is white too, but it dissolves in acid.', 'Barium chloride already dissolves.', 'The flame test is separate.']]
      },
      tryit: {
        q: `Which ion gives a brick-red flame?`,
        ask: `Choose the ion.`, o: ['Ca²⁺', 'Na⁺', 'K⁺', 'Cu²⁺'], a: 0,
        h: `It is the ion in limestone.`, e: `Calcium gives a brick-red flame.`,
        fb: ['', 'Sodium gives a yellow flame.', 'Potassium gives a lilac flame.', 'Copper gives a blue-green flame.']
      }
    }
  ],
  spot: { part: 1, who: 'Chinedu', q: `A solution gives a white precipitate with NaOH that dissolves in excess. He concludes it contains Zn²⁺.`, lines: ['White precipitate with NaOH', 'It dissolves in excess NaOH', 'So the ion must be Zn²⁺'], bad: 2,
    okfb: ['That observation is right.', 'That observation is right.'],
    o: ['Al³⁺ and Pb²⁺ do the same. Test with excess ammonia to be sure', 'Zinc gives a blue precipitate', 'A precipitate never dissolves in excess', 'Nothing is wrong'],
    fb: ['That is it.', 'Zinc hydroxide is white.', 'Amphoteric hydroxides do dissolve in excess.', 'Three different ions give this same result.'],
    h: ['Which other ions give a white precipitate that dissolves in excess NaOH?'], fix: 'Add ammonia: only Zn(OH)₂ dissolves in excess ammonia.' },
  qs: [
    { l: 1, q: `Which gas gives a squeaky pop with a lighted splint?`, o: ['Hydrogen', 'Oxygen', 'Carbon dioxide', 'Chlorine'], a: 0, e: `Hydrogen burns with a small pop.`, w: ['', 'Oxygen relights a glowing splint.', 'CO₂ puts flames out.', 'Chlorine bleaches litmus.'] },
    { l: 1, q: `What colour does sodium give to a flame?`, o: ['Yellow', 'Lilac', 'Brick-red', 'Blue-green'], a: 0, e: `Sodium gives a strong yellow flame.`, w: ['', 'Lilac is potassium.', 'Brick-red is calcium.', 'Blue-green is copper.'] },
    { l: 2, dx: 1, q: `A solution gives a blue precipitate with sodium hydroxide. Which ion is present?`, o: ['Cu²⁺', 'Fe²⁺', 'Fe³⁺', 'Zn²⁺'], a: 0, e: `Copper(II) hydroxide is blue.`, w: ['', 'Iron(II) hydroxide is green.', 'Iron(III) hydroxide is red-brown.', 'Zinc hydroxide is white.'] },
    { l: 2, q: `Which reagent tests for sulphate ions?`, o: ['Acidified barium chloride', 'Acidified silver nitrate', 'Limewater', 'Sodium hydroxide'], a: 0, e: `Ba²⁺ + SO₄²⁻ → BaSO₄, a white precipitate.`, w: ['', 'Silver nitrate tests for halides.', 'Limewater tests for CO₂.', 'NaOH tests for metal ions.'] },
    { l: 2, q: `A gas bleaches damp litmus paper. It is`, o: ['chlorine', 'ammonia', 'hydrogen', 'carbon dioxide'], a: 0, e: `Chlorine bleaches damp litmus.`, w: ['', 'Ammonia turns red litmus blue.', 'Hydrogen has no effect on litmus.', 'CO₂ turns litmus slightly red but does not bleach it.'] },
    { l: 3, q: `Excess ammonia solution is added to a solution containing Cu²⁺. What is seen?`, o: ['A blue precipitate that dissolves to give a deep blue solution', 'A white precipitate', 'A green precipitate', 'No change'], a: 0, e: `The blue Cu(OH)₂ dissolves in excess ammonia to form a deep blue complex ion.`, w: ['', 'Copper does not give a white precipitate.', 'Green is iron(II).', 'A clear change is seen.'] },
    { l: 3, q: `How can you show that a solution contains ammonium ions?`, o: ['Warm with NaOH and test the gas with damp red litmus', 'Add silver nitrate', 'Add barium chloride', 'Do a flame test'], a: 0, e: `NH₄⁺ + OH⁻ → NH₃ + H₂O. The ammonia turns red litmus blue.`, w: ['', 'Silver nitrate tests for halides.', 'Barium chloride tests for sulphate.', 'Ammonium gives no flame colour.'] },
    { l: 3, q: `Dilute hydrochloric acid added to a white solid gives a gas that turns limewater milky. The solid contains`, o: ['carbonate ions', 'sulphate ions', 'chloride ions', 'nitrate ions'], a: 0, e: `Acids release CO₂ from carbonates.`, w: ['', 'Sulphates give no gas with acid.', 'Chlorides give no gas with acid.', 'Nitrates give no gas with dilute acid.'] },
    { l: 4, q: `A white precipitate forms with NaOH and dissolves in excess. With ammonia, the white precipitate does NOT dissolve in excess. The ion could be`, o: ['Al³⁺', 'Zn²⁺', 'Ca²⁺', 'Cu²⁺'], a: 0, e: `Al(OH)₃ dissolves in excess NaOH but not in excess ammonia. Pb²⁺ behaves the same way.`, w: ['', 'Zn(OH)₂ dissolves in excess ammonia.', 'Ca(OH)₂ does not dissolve in excess NaOH.', 'Copper gives a blue precipitate.'] },
    { l: 4, q: `In the test for nitrate ions, the solution is warmed with sodium hydroxide and aluminium. Which gas is given off?`, o: ['Ammonia', 'Nitrogen dioxide', 'Hydrogen only', 'Oxygen'], a: 0, e: `Aluminium reduces nitrate to ammonia in alkali.`, w: ['', 'NO₂ comes from heating solid nitrates.', 'Some hydrogen may form, but ammonia is the test.', 'Oxygen is not formed.'] },
    { l: 5, q: `A green solid gives a green precipitate with NaOH and a white precipitate with acidified BaCl₂. It is`, o: ['iron(II) sulphate', 'copper(II) sulphate', 'iron(III) chloride', 'zinc sulphate'], a: 0, e: `Green precipitate: Fe²⁺. White with BaCl₂: SO₄²⁻. So FeSO₄.`, w: ['', 'Copper gives a blue precipitate.', 'Iron(III) gives a red-brown precipitate, and chloride needs silver nitrate.', 'Zinc gives a white precipitate.'] },
    { l: 5, q: `Why does a green iron(II) hydroxide precipitate turn brown at the surface when left in air?`, o: ['It is oxidised to iron(III) hydroxide', 'It is reduced', 'It dissolves', 'It reacts with nitrogen'], a: 0, e: `Oxygen in the air oxidises Fe²⁺ to Fe³⁺, which is red-brown.`, w: ['', 'Gaining oxygen and losing electrons is oxidation.', 'It stays solid.', 'Nitrogen is unreactive.'] }
  ]
}
);

/* Chemistry, Section V: Organic and nuclear chemistry */
const ST = {
  ethane: ['struct', { rows: ['  H H  ', '  | |  ', 'H-C-C-H', '  | |  ', '  H H  '], name: 'ethane, C₂H₆' }],
  ethene: ['struct', { rows: ['H     H', ' \\   / ', '  C=C  ', ' /   \\ ', 'H     H'], name: 'ethene, C₂H₄' }],
  ethanol: ['struct', { rows: ['  H H    ', '  | |    ', 'H-C-C-O-H', '  | |    ', '  H H    '], name: 'ethanol, C₂H₅OH' }],
  ethanoic: ['struct', { rows: ['  H O    ', '  | "    ', 'H-C-C    ', '  |  \\   ', '  H   O-H'], name: 'ethanoic acid, CH₃COOH' }]
};;

const DECAY = ['cplot', { xmax: 9, ymax: 90, xt: [2, 4, 6, 8], yt: [20, 40, 60, 80], xl: 'Time / days', yl: 'Mass / g', curves: [{ pts: [[0, 80], [1, 56.6], [2, 40], [3, 28.3], [4, 20], [5, 14.1], [6, 10], [7, 7.1], [8, 5]] }], read: [2, 40], label: 'Decay curve: 80 g falls to 40 g after 2 days, 20 g after 4 days and 10 g after 6 days' }];

CHEM.topics.push(

/* ───────────── HYDROCARBONS ───────────── */
{
  id: 'c-hydro', name: 'Hydrocarbons and Petroleum', sec: 'Section V · Organic and nuclear chemistry',
  goals: ['Name and draw alkanes, alkenes and alkynes, and their isomers', 'Compare substitution and addition reactions', 'Describe how petroleum is refined and cracked'],
  trap: `Alkenes decolourise bromine water at once. Alkanes do not, unless they are in sunlight for a long time. This is the standard test for a C=C double bond.`,
  parts: [
    {
      title: 'Homologous series and naming',
      idea: `Organic compounds come in families called homologous series. Members of a series share a general formula and a functional group, react in the same way, and differ from the next member by CH₂.`,
      g: ST.ethane, cap: `Ethane, the second alkane: every carbon has four single bonds.`,
      rules: [
        `Alkanes C<sub>n</sub>H<sub>2n+2</sub> (single bonds only). Alkenes C<sub>n</sub>H<sub>2n</sub> (one C=C). Alkynes C<sub>n</sub>H<sub>2n−2</sub> (one C≡C).`,
        `Prefixes for the number of carbons: meth 1, eth 2, prop 3, but 4, pent 5, hex 6.`,
        `Structural isomers have the same molecular formula but different structures, such as butane and 2-methylpropane, both C₄H₁₀.`
      ],
      ex: {
        q: `An alkane has 5 carbon atoms. Give its molecular formula and name.`,
        steps: [
          [`Alkanes are C<sub>n</sub>H<sub>2n+2</sub>`, `The general formula.`],
          [`n = 5: H = 2 × 5 + 2 = 12`, `Put n into the formula.`],
          [`C₅H₁₂, pentane`, `Pent- means 5.`]
        ],
        why: [1, 'Why 2n + 2 hydrogens?', ['Each carbon has two H on the sides, and the two end carbons have one extra each', 'Because hydrogen is diatomic', 'Every compound has twice as many H as C'], ['Right.', 'H₂ being diatomic has nothing to do with it.', 'Alkenes have exactly 2n, and alkanes have 2n + 2.']]
      },
      tryit: {
        q: `Which is the molecular formula of propene?`,
        ask: `Choose the formula.`, o: [ch('C3H6'), ch('C3H8'), ch('C3H4'), ch('C2H4')], a: 0,
        h: `Propene is an alkene with 3 carbons: C<sub>n</sub>H<sub>2n</sub>.`, e: `n = 3, so C₃H₆.`,
        fb: ['', 'C₃H₈ is propane, an alkane.', 'C₃H₄ is propyne, an alkyne.', 'C₂H₄ is ethene, with 2 carbons.']
      }
    },
    {
      title: 'Reactions of alkanes and alkenes',
      idea: `Alkanes are saturated and fairly unreactive: apart from burning, they react by substitution. Alkenes are unsaturated: the double bond opens up and other atoms add on.`,
      g: ST.ethene, cap: `Ethene: the C=C double bond is where addition happens.`,
      rules: [
        `Substitution (alkanes, in UV light): CH₄ + Cl₂ ${RA} CH₃Cl + HCl.`,
        `Addition (alkenes): C₂H₄ + Br₂ ${RA} C₂H₄Br₂ (bromine water goes from orange to colourless). With H₂ and a nickel catalyst: C₂H₄ + H₂ ${RA} C₂H₆.`,
        `Alkenes join together to form addition polymers, such as poly(ethene).`
      ],
      ex: {
        q: `How can you tell hexane from hexene?`,
        steps: [
          [`Shake each with bromine water`, `Bromine water is orange.`],
          [`Hexene decolourises it at once`, `Bromine adds across the C=C bond.`],
          [`Hexane leaves it orange`, `It has no double bond, so no addition happens.`]
        ],
        why: [1, 'Why does the colour disappear?', ['The orange bromine is used up as it adds to the alkene', 'Hexene is a bleach', 'The bromine evaporates'], ['Right. The product is colourless.', 'Hexene does not bleach.', 'It reacts, it does not evaporate.']]
      },
      tryit: {
        q: `What type of reaction happens between methane and chlorine in sunlight?`,
        ask: `Choose the type.`, o: ['Substitution', 'Addition', 'Polymerisation', 'Neutralisation'], a: 0,
        h: `Methane has no double bond to open.`, e: `A chlorine atom takes the place of a hydrogen atom: CH₄ + Cl₂ ${RA} CH₃Cl + HCl.`,
        fb: ['', 'Addition needs a double bond.', 'Methane cannot form an addition polymer.', 'No acid and base react here.']
      }
    },
    {
      title: 'Petroleum',
      idea: `Crude oil is a mixture of hydrocarbons. It is separated into fractions by fractional distillation. Cracking breaks large, less useful molecules into smaller ones, including alkenes.`,
      rules: [
        `Fractions, from the top of the column: refinery gas, petrol, naphtha, kerosene, diesel, lubricating oil, bitumen.`,
        `Larger molecules: higher boiling point, more viscous, harder to light.`,
        `Cracking: C₁₀H₂₂ ${RA} C₈H₁₈ + C₂H₄, using heat and a catalyst. The octane number measures how smoothly petrol burns.`
      ],
      ex: {
        q: `Why is cracking carried out?`,
        steps: [
          [`Crude oil has more large molecules than are needed`, `There is too much heavy oil.`],
          [`Demand for petrol and alkenes is greater`, `Alkenes are used to make plastics.`],
          [`Cracking turns the surplus large molecules into these smaller, more useful ones`, `Supply then matches demand.`]
        ],
        why: [2, 'Why are alkenes useful?', ['Their double bond lets them form polymers and other chemicals', 'They are better fuels than alkanes', 'They do not burn'], ['Right.', 'They are mainly valued as raw materials, not fuels.', 'Alkenes burn readily.']]
      },
      tryit: {
        q: `Which fraction has the highest boiling point?`,
        ask: `Choose the fraction.`, o: ['Bitumen', 'Petrol', 'Kerosene', 'Refinery gas'], a: 0,
        h: `It comes out at the bottom of the column.`, e: `Bitumen has the largest molecules, so the highest boiling point. It is used for roads.`,
        fb: ['', 'Petrol has small molecules.', 'Kerosene is in the middle.', 'Refinery gas has the lowest boiling point.']
      }
    }
  ],
  spot: { part: 0, who: 'Femi', q: `Give the general formula of the alkenes, and the formula of the alkene with 4 carbon atoms.`, lines: ['Alkenes have the general formula C<sub>n</sub>H<sub>2n+2</sub>', 'With n = 4: C₄H₁₀', 'This is butene'], bad: 0,
    okfb: ['The arithmetic follows from line 1.', 'Butene is the right name for a 4-carbon alkene.'],
    o: ['C<sub>n</sub>H<sub>2n+2</sub> is for alkanes. Alkenes are C<sub>n</sub>H<sub>2n</sub>, so butene is C₄H₈', 'n should be 5', 'The name should be butane', 'Nothing is wrong'],
    fb: ['That is it.', 'But- means 4.', 'Butane is the alkane, C₄H₁₀.', 'C₄H₁₀ is butane, with no double bond.'],
    h: ['Which family has the formula C<sub>n</sub>H<sub>2n+2</sub>?'], fix: 'Alkenes are C<sub>n</sub>H<sub>2n</sub>, so butene is C₄H₈.' },
  qs: [
    { l: 1, q: `Hydrocarbons contain only`, o: ['carbon and hydrogen', 'carbon, hydrogen and oxygen', 'carbon and oxygen', 'hydrogen and oxygen'], a: 0, e: `Hydro + carbon: only H and C.`, w: ['', 'Compounds with oxygen too are not hydrocarbons.', 'There must be hydrogen.', 'There must be carbon.'] },
    { l: 1, q: `Which is the first member of the alkanes?`, o: ['Methane', 'Ethane', 'Ethene', 'Propane'], a: 0, e: `Methane, CH₄, has one carbon atom.`, w: ['', 'Ethane has 2 carbons.', 'Ethene is an alkene.', 'Propane has 3 carbons.'] },
    { l: 2, dx: 1, q: `Which compound decolourises bromine water quickly?`, o: ['Ethene', 'Ethane', 'Methane', 'Propane'], a: 0, e: `Ethene has a C=C double bond, so bromine adds to it.`, w: ['', 'Ethane is saturated.', 'Methane is saturated.', 'Propane is saturated.'] },
    { l: 2, q: `What is the molecular formula of the alkane with 6 carbon atoms?`, o: [ch('C6H14'), ch('C6H12'), ch('C6H10'), ch('C6H6')], a: 0, e: `C<sub>n</sub>H<sub>2n+2</sub>: 2 × 6 + 2 = 14.`, w: ['', 'C₆H₁₂ is hexene.', 'C₆H₁₀ is hexyne.', 'C₆H₆ is benzene.'] },
    { l: 2, q: `Members of a homologous series differ by`, o: ['CH₂', 'CH₃', 'C₂H₄', 'H₂'], a: 0, e: `Each member has one more CH₂ unit than the one before.`, w: ['', 'CH₃ is a methyl group, not the step between members.', 'That is two steps.', 'Adding H₂ changes the series.'] },
    { l: 3, q: `How many structural isomers does C₄H₁₀ have?`, o: ['2', '1', '3', '4'], a: 0, e: `Butane (a straight chain) and 2-methylpropane (a branched chain).`, w: ['', 'There is a branched isomer as well.', 'C₅H₁₂ has 3 isomers.', 'Only two different structures are possible.'] },
    { l: 3, q: `Ethene reacts with hydrogen over a nickel catalyst to form`, o: ['ethane', 'ethanol', 'ethyne', 'poly(ethene)'], a: 0, e: `C₂H₄ + H₂ → C₂H₆. This is hydrogenation.`, w: ['', 'Ethanol is made by adding water (steam).', 'Ethyne has fewer hydrogens.', 'Poly(ethene) forms when ethene molecules join together.'] },
    { l: 3, q: `Ethyne is prepared in the lab from water and`, o: ['calcium carbide', 'calcium carbonate', 'ethanol', 'methane'], a: 0, e: `CaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂.`, w: ['', 'Calcium carbonate gives CO₂ with acid.', 'Ethanol gives ethene when dehydrated.', 'Methane is not converted this way.'] },
    { l: 4, q: `Which product forms when one mole of ethene reacts with one mole of bromine?`, o: ['1,2-dibromoethane', 'bromoethane', '1,1-dibromoethane', 'bromoethene'], a: 0, e: `Each bromine atom joins one carbon of the double bond: CH₂Br–CH₂Br.`, w: ['', 'Bromoethane forms with HBr, not Br₂.', 'The two Br atoms add to different carbons.', 'Addition removes the double bond.'] },
    { l: 4, q: `Complete the cracking equation: C₁₂H₂₆ → C₁₀H₂₂ + ?`, o: [ch('C2H4'), ch('C2H6'), ch('C2H2'), ch('CH4')], a: 0, e: `Carbon: 12 − 10 = 2. Hydrogen: 26 − 22 = 4. So C₂H₄, ethene.`, w: ['', 'Count the hydrogens: 26 − 22 = 4.', 'Count the hydrogens: 26 − 22 = 4.', 'Count the carbons: 12 − 10 = 2.'] },
    { l: 5, q: `What volume of oxygen is needed to burn 10 cm³ of propane completely? C₃H₈ + 5O₂ → 3CO₂ + 4H₂O`, o: ['50 cm³', '30 cm³', '10 cm³', '80 cm³'], a: 0, e: `Gas volumes react in the mole ratio, 1 : 5.`, w: ['', '30 cm³ is the CO₂ made.', 'The ratio is 1 : 5, not 1 : 1.', 'That adds the volumes of the products.'] },
    { l: 5, q: `A hydrocarbon contains 85.7% carbon by mass. What is its empirical formula? (C = 12, H = 1)`, o: [ch('CH2'), ch('CH3'), ch('CH4'), 'CH'], a: 0, e: `C: 85.7 ÷ 12 = 7.14. H: 14.3 ÷ 1 = 14.3. Ratio 1 : 2, so CH₂, the empirical formula of the alkenes.`, w: ['', 'Check the ratio: 14.3 ÷ 7.14 = 2.', 'That would be 75% carbon.', 'That would be 92.3% carbon.'] }
  ]
},

/* ───────────── ALCOHOLS, ACIDS AND ESTERS ───────────── */
{
  id: 'c-func', name: 'Alcohols, Acids and Esters', sec: 'Section V · Organic and nuclear chemistry',
  goals: ['Describe how ethanol is made and its reactions', 'Describe the reactions of ethanoic acid', 'Name esters and explain esterification'],
  trap: `To name an ester, the alcohol gives the first word and the acid gives the second. Ethanol and ethanoic acid give ethyl ethanoate. Methanol and ethanoic acid give methyl ethanoate.`,
  parts: [
    {
      title: 'Alcohols',
      idea: `Alcohols contain the –OH group. Ethanol, C₂H₅OH, is made by fermenting sugars with yeast, or industrially by adding steam to ethene.`,
      g: ST.ethanol, cap: `Ethanol: the –OH group is what makes it an alcohol.`,
      rules: [
        `Fermentation: C₆H₁₂O₆ ${RA} 2C₂H₅OH + 2CO₂, with yeast (the enzyme zymase), about 35 °C, no air.`,
        `Hydration: C₂H₄ + H₂O ${RA} C₂H₅OH, with phosphoric acid catalyst, about 300 °C and 60 atm.`,
        `Ethanol is oxidised by acidified K₂Cr₂O₇ (orange to green) to ethanoic acid. It reacts with sodium to give hydrogen.`
      ],
      ex: {
        q: `Why must air be kept out during fermentation?`,
        steps: [
          [`Yeast respires anaerobically to make ethanol`, `Without oxygen.`],
          [`With air, bacteria oxidise ethanol`, `C₂H₅OH + O₂ ${RA} CH₃COOH + H₂O.`],
          [`The ethanol would turn sour, into vinegar`, `So the air is kept out.`]
        ],
        why: [1, 'Why does air turn ethanol into vinegar?', ['Oxygen oxidises ethanol to ethanoic acid, the acid in vinegar', 'Air cools the yeast', 'Air dilutes the ethanol'], ['Right. That is why opened palm wine turns sour.', 'Temperature is not the reason.', 'Dilution would not make it sour.']]
      },
      tryit: {
        q: `What is seen when ethanol is warmed with acidified potassium dichromate(VI)?`,
        ask: `Choose the colour change.`, o: ['Orange to green', 'Green to orange', 'Purple to colourless', 'Colourless to pink'], a: 0,
        h: `Dichromate is reduced as it oxidises the ethanol.`, e: `Orange Cr₂O₇²⁻ is reduced to green Cr³⁺.`,
        fb: ['', 'It goes the other way.', 'That is acidified potassium permanganate.', 'That is phenolphthalein in alkali.']
      }
    },
    {
      title: 'Carboxylic acids and esters',
      idea: `Carboxylic acids contain the –COOH group. They are weak acids. With an alcohol and a little concentrated sulphuric acid, they form esters, which have fruity smells.`,
      g: ST.ethanoic, cap: `Ethanoic acid: the –COOH group.`,
      rules: [
        `Ethanoic acid reacts like other acids: with carbonates to give CO₂, and with bases to form ethanoates.`,
        `Esterification: CH₃COOH + C₂H₅OH ${EQM} CH₃COOC₂H₅ + H₂O, with conc. H₂SO₄ as catalyst.`,
        `Esters are used in perfumes and flavourings. Fats and oils are esters too.`
      ],
      ex: {
        q: `Name the ester made from methanol and propanoic acid.`,
        steps: [
          [`The alcohol gives the first part: methanol ${RA} methyl`, `-anol becomes -yl.`],
          [`The acid gives the second part: propanoic acid ${RA} propanoate`, `-oic acid becomes -oate.`],
          [`Methyl propanoate`, `Alcohol part first, then acid part.`]
        ],
        why: [0, 'Why does methanol become "methyl"?', ['In the ester, the alcohol provides the alkyl group joined to the oxygen', 'Because methanol has one carbon', 'It is always written that way for all compounds'], ['Right.', 'One carbon gives "meth", but "-yl" shows it is now an alkyl group.', 'It is the rule for esters.']]
      },
      tryit: {
        q: `What is the role of concentrated sulphuric acid in esterification?`,
        ask: `Choose its role.`, o: ['Catalyst', 'Reactant that ends up in the ester', 'Oxidising agent', 'Solvent only'], a: 0,
        h: `It speeds up the reaction and is not part of the ester.`, e: `It is a catalyst. It also removes the water, which helps push the equilibrium to the right.`,
        fb: ['', 'The ester contains no sulphur.', 'Nothing is oxidised in esterification.', 'Only a few drops are used. It is a catalyst.']
      }
    }
  ],
  spot: { part: 1, who: 'Joy', q: `Name the ester formed from ethanol and methanoic acid.`, lines: ['The acid is methanoic acid', 'The alcohol is ethanol', 'The ester is methyl ethanoate'], bad: 2,
    okfb: ['Correct.', 'Correct.'],
    o: ['The alcohol part comes first: ethyl methanoate', 'It should be methyl methanoate', 'It should be ethanoic ethanol', 'Nothing is wrong'],
    fb: ['That is it.', 'The alcohol is ethanol, which gives "ethyl".', 'That is not an ester name.', 'She swapped the two parts.'],
    h: ['Which part of the name comes from the alcohol?'], fix: 'Ethanol gives "ethyl", methanoic acid gives "methanoate": ethyl methanoate.' },
  qs: [
    { l: 1, q: `The functional group of the alcohols is`, o: ['–OH', '–COOH', 'C=C', '–COO–'], a: 0, e: `Alcohols contain the hydroxyl group, –OH.`, w: ['', '–COOH is the carboxylic acid group.', 'C=C is the alkene group.', '–COO– is the ester link.'] },
    { l: 1, q: `Which gas is given off during fermentation?`, o: ['Carbon dioxide', 'Oxygen', 'Hydrogen', 'Methane'], a: 0, e: `C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂.`, w: ['', 'Oxygen is not produced.', 'Hydrogen is not produced.', 'Methane comes from a different, bacterial process.'] },
    { l: 2, dx: 1, q: `Ethanol is oxidised to`, o: ['ethanoic acid', 'ethene', 'ethane', 'ethyl ethanoate'], a: 0, e: `Strong oxidation turns CH₃CH₂OH into CH₃COOH.`, w: ['', 'Ethene comes from dehydration, not oxidation.', 'Ethane would need reduction.', 'An ester needs an acid as well.'] },
    { l: 2, q: `Which enzyme in yeast converts glucose to ethanol?`, o: ['Zymase', 'Amylase', 'Diastase', 'Pepsin'], a: 0, e: `Zymase catalyses fermentation.`, w: ['', 'Amylase breaks starch into sugars.', 'Diastase breaks starch into maltose.', 'Pepsin digests proteins.'] },
    { l: 2, q: `Esters are known for their`, o: ['fruity smell', 'blue colour', 'strong acidity', 'high melting points'], a: 0, e: `Many esters smell of fruit and are used as flavourings.`, w: ['', 'Esters are colourless.', 'Esters are neutral.', 'Simple esters are volatile liquids.'] },
    { l: 3, q: `Ethanoic acid reacts with sodium carbonate to give`, o: ['sodium ethanoate, water and carbon dioxide', 'ethanol and carbon dioxide', 'ethyl ethanoate', 'sodium ethoxide and hydrogen'], a: 0, e: `Like any acid: acid + carbonate → salt + water + CO₂.`, w: ['', 'The acid is not reduced to ethanol.', 'An ester needs an alcohol.', 'Sodium ethoxide forms from ethanol and sodium.'] },
    { l: 3, q: `What is the name of CH₃COOCH₃?`, o: ['Methyl ethanoate', 'Ethyl methanoate', 'Methyl methanoate', 'Ethyl ethanoate'], a: 0, e: `CH₃COO– comes from ethanoic acid, and –CH₃ from methanol: methyl ethanoate.`, w: ['', 'The acid part, CH₃COO–, has two carbons: ethanoate.', 'The acid part has two carbons.', 'The alcohol part has only one carbon.'] },
    { l: 3, q: `Ethanol reacts with sodium to give`, o: ['hydrogen gas', 'oxygen gas', 'carbon dioxide', 'ethene'], a: 0, e: `2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂.`, w: ['', 'Oxygen is not produced.', 'CO₂ is not produced.', 'Ethene forms on dehydration with conc. H₂SO₄.'] },
    { l: 4, q: `Ethanol is heated with excess concentrated sulphuric acid at about 170 °C. The product is`, o: ['ethene', 'ethanoic acid', 'ethyl ethanoate', 'ethane'], a: 0, e: `The acid removes water: C₂H₅OH → C₂H₄ + H₂O.`, w: ['', 'Oxidation needs an oxidising agent like dichromate.', 'An ester needs a carboxylic acid.', 'Ethane would need reduction.'] },
    { l: 4, q: `What mass of ethanol can be made from 90 g of glucose? (C₆H₁₂O₆ = 180, C₂H₅OH = 46)`, o: ['46 g', '23 g', '92 g', '90 g'], a: 0, e: `90 ÷ 180 = 0.5 mol glucose, giving 1.0 mol ethanol = 46 g.`, w: ['', 'Each glucose gives 2 ethanol, not 1.', 'That would need 1 mol of glucose.', 'Mass is not equal across the equation: CO₂ is also made.'] },
    { l: 5, q: `Which of these is a secondary alcohol?`, o: ['Propan-2-ol', 'Propan-1-ol', 'Ethanol', 'Methanol'], a: 0, e: `In propan-2-ol, the –OH is on a carbon joined to two other carbons.`, w: ['', 'In propan-1-ol, the –OH carbon is joined to only one carbon: primary.', 'Ethanol is primary.', 'Methanol is a special case, treated like a primary alcohol.'] },
    { l: 5, q: `Why is esterification carried out under reflux?`, o: ['The reaction is slow, and refluxing lets it be heated without losing volatile liquids', 'To make the ester boil away', 'To cool the mixture', 'To add oxygen'], a: 0, e: `A reflux condenser returns the vapours to the flask, so the mixture can be heated for a long time.`, w: ['', 'The aim is to keep the ester.', 'Reflux is for heating, not cooling.', 'No oxygen is needed.'] }
  ]
},

/* ───────────── POLYMERS, FATS AND FOOD CHEMISTRY ───────────── */
{
  id: 'c-poly', name: 'Polymers, Fats and Soaps', sec: 'Section V · Organic and nuclear chemistry',
  goals: ['Tell addition and condensation polymers apart', 'Describe natural polymers: starch, proteins and rubber', 'Explain how soap is made and why detergents work in hard water'],
  trap: `Addition polymers form with nothing lost. Condensation polymers lose a small molecule, usually water, every time two units join.`,
  parts: [
    {
      title: 'Polymers',
      idea: `A polymer is a very long molecule made of many small units, called monomers, joined together. Plastics are synthetic polymers. Starch, proteins and rubber are natural ones.`,
      rules: [
        `Addition: alkenes join, and nothing else is formed. Ethene gives poly(ethene). Chloroethene gives PVC.`,
        `Condensation: monomers join and lose water each time. Examples: nylon, terylene, proteins, starch.`,
        `Thermoplastics soften on heating and can be remoulded. Thermosets set hard and cannot.`
      ],
      ex: {
        q: `Ethene is polymerised. What type of polymerisation is this, and what forms?`,
        steps: [
          [`Ethene has a C=C double bond`, `The double bond can open.`],
          [`Thousands of molecules join: n CH₂=CH₂ ${RA} (–CH₂–CH₂–)<sub>n</sub>`, `Nothing else is formed.`],
          [`Addition polymerisation. The product is poly(ethene)`, `Used for bags and bottles.`]
        ],
        why: [1, 'Why is nothing else formed?', ['Every atom of the monomers ends up in the polymer', 'The water evaporates', 'The hydrogen escapes'], ['Right. That is what makes it addition.', 'No water forms in addition polymerisation.', 'No hydrogen is lost.']]
      },
      tryit: {
        q: `Which of these is a condensation polymer?`,
        ask: `Choose the polymer.`, o: ['Nylon', 'Poly(ethene)', 'PVC', 'Polystyrene'], a: 0,
        h: `Which one loses water as it forms?`, e: `Nylon forms by condensation: a small molecule is lost at each link.`,
        fb: ['', 'Poly(ethene) is an addition polymer.', 'PVC is an addition polymer.', 'Polystyrene is an addition polymer.']
      }
    },
    {
      title: 'Fats, oils and soap',
      idea: `Fats and oils are esters of glycerol (propane-1,2,3-triol) and long-chain fatty acids. Boiling them with sodium hydroxide splits them into glycerol and soap. This is saponification.`,
      rules: [
        `Fat + NaOH ${RA} soap (sodium salt of a fatty acid) + glycerol.`,
        `Soap forms scum with hard water. Soapless detergents do not, because their calcium salts are soluble.`,
        `Oils are unsaturated (C=C bonds). They are hardened into margarine by adding hydrogen with a nickel catalyst.`
      ],
      ex: {
        q: `Why do soapless detergents work well in hard water, while soap does not?`,
        steps: [
          [`Hard water contains Ca²⁺ and Mg²⁺`, `These cause hardness.`],
          [`Soap forms insoluble calcium salts: scum`, `The soap is wasted.`],
          [`Detergents form soluble calcium salts`, `So no scum forms and they keep cleaning.`]
        ],
        why: [1, 'Why is scum a problem?', ['Soap is used up making it, and it leaves a grey deposit', 'Scum is poisonous', 'Scum makes water soft'], ['Right.', 'It is not poisonous, just wasteful and messy.', 'Forming scum does remove calcium, but it wastes soap.']]
      },
      tryit: {
        q: `What are the products of saponification of a fat with sodium hydroxide?`,
        ask: `Choose the products.`, o: ['Soap and glycerol', 'Soap and water', 'Glycerol and fatty acid', 'Ester and water'], a: 0,
        h: `The fat is an ester of glycerol.`, e: `The ester splits: the fatty acid part becomes soap, and glycerol is set free.`,
        fb: ['', 'Glycerol is the other product.', 'With NaOH, the fatty acid becomes its sodium salt, which is soap.', 'That is esterification in reverse, but with acid, not alkali.']
      }
    },
    {
      title: 'Food chemistry: starch, sugars and proteins',
      idea: `Starch is a natural polymer of glucose, and proteins are polymers of amino acids. Simple tests show which of them are present in a food.`,
      rules: [
        `Starch: iodine solution turns blue-black.`,
        `Glucose (a reducing sugar): warm with Fehling's or Benedict's solution, a brick-red precipitate forms.`,
        `Proteins: the biuret test (NaOH and copper(II) sulphate) gives a violet colour. Starch is hydrolysed to glucose by acid or by enzymes.`
      ],
      ex: {
        q: `A food sample turns iodine solution blue-black and gives no precipitate with Fehling's solution. What does it contain?`,
        steps: [
          [`Blue-black with iodine: starch is present`, `Starch test.`],
          [`No precipitate with Fehling's: no reducing sugar`, `Glucose is absent.`],
          [`It contains starch but no glucose`, `For example, raw flour.`]
        ],
        why: [1, 'Why does starch itself not give a precipitate with Fehling\'s?', ['Starch is not a reducing sugar', 'Starch is not soluble at all', 'Fehling\'s solution only tests for proteins'], ['Right. It must first be hydrolysed to glucose.', 'Starch disperses in hot water. The test fails because it is not a reducing sugar.', 'Fehling\'s tests for reducing sugars.']]
      },
      tryit: {
        q: `Which reagent shows the presence of protein?`,
        ask: `Choose the test.`, o: ['Biuret reagent', 'Iodine solution', 'Fehling\'s solution', 'Limewater'], a: 0,
        h: `It turns violet with protein.`, e: `The biuret test gives a violet colour with proteins.`,
        fb: ['', 'Iodine tests for starch.', 'Fehling\'s tests for reducing sugars.', 'Limewater tests for CO₂.']
      }
    }
  ],
  spot: { part: 0, who: 'Emeka', q: `Explain why PVC is an addition polymer.`, lines: ['PVC is made from chloroethene, CH₂=CHCl', 'Its molecules join and lose water each time', 'So it is an addition polymer'], bad: 1,
    okfb: ['Right: the monomer is chloroethene.', 'The conclusion is right, but not for the reason given.'],
    o: ['In addition polymerisation nothing is lost. The C=C bonds just open and join', 'PVC is made from ethene', 'PVC is a natural polymer', 'Nothing is wrong'],
    fb: ['That is it.', 'The monomer contains chlorine: chloroethene.', 'PVC is synthetic.', 'Losing water is condensation, not addition.'],
    h: ['Does anything leave when alkenes join?'], fix: 'The C=C double bonds open and the monomers join with nothing lost: addition polymerisation.' },
  qs: [
    { l: 1, q: `The small units that join to make a polymer are called`, o: ['monomers', 'isomers', 'isotopes', 'allotropes'], a: 0, e: `Mono = one unit, poly = many.`, w: ['', 'Isomers have the same formula but different structures.', 'Isotopes are atoms of one element.', 'Allotropes are forms of one element.'] },
    { l: 1, q: `Which test shows the presence of starch?`, o: ['Iodine turns blue-black', 'Fehling\'s gives a brick-red precipitate', 'Biuret turns violet', 'Limewater turns milky'], a: 0, e: `Iodine solution turns blue-black with starch.`, w: ['', 'That is the test for reducing sugars.', 'That is the test for proteins.', 'That is the test for CO₂.'] },
    { l: 2, dx: 1, q: `Which monomer is used to make PVC?`, o: ['Chloroethene', 'Ethene', 'Propene', 'Styrene'], a: 0, e: `PVC is poly(chloroethene), also called polyvinyl chloride.`, w: ['', 'Ethene makes poly(ethene).', 'Propene makes poly(propene).', 'Styrene makes polystyrene.'] },
    { l: 2, q: `Saponification is the`, o: ['alkaline hydrolysis of fats to make soap', 'hardening of oils', 'fermentation of sugar', 'cracking of oil'], a: 0, e: `Fat + NaOH → soap + glycerol.`, w: ['', 'Hardening oils is hydrogenation.', 'Fermentation makes ethanol.', 'Cracking breaks down hydrocarbons.'] },
    { l: 2, q: `Proteins are polymers of`, o: ['amino acids', 'glucose', 'fatty acids', 'ethene'], a: 0, e: `Amino acids join by condensation to form proteins.`, w: ['', 'Glucose makes starch and cellulose.', 'Fatty acids are part of fats.', 'Ethene makes poly(ethene).'] },
    { l: 3, q: `Which statement about thermosetting plastics is true?`, o: ['They cannot be softened again by heating', 'They melt easily', 'They are all addition polymers', 'They can be recycled by remelting'], a: 0, e: `Cross-links form as they set, so they char instead of softening.`, w: ['', 'That is a thermoplastic.', 'Many are condensation polymers.', 'That is true of thermoplastics.'] },
    { l: 3, q: `Natural rubber is a polymer of`, o: ['isoprene', 'ethene', 'glucose', 'amino acids'], a: 0, e: `Rubber is poly(2-methylbuta-1,3-diene), from isoprene units.`, w: ['', 'Ethene makes poly(ethene).', 'Glucose makes starch.', 'Amino acids make proteins.'] },
    { l: 3, q: `Which molecule is lost when two amino acids join?`, o: ['Water', 'Carbon dioxide', 'Hydrogen', 'Ammonia'], a: 0, e: `Condensation: –COOH and –NH₂ join and lose H₂O, forming a peptide link.`, w: ['', 'CO₂ is not lost.', 'H₂ is not lost.', 'NH₃ is not lost.'] },
    { l: 4, q: `Why are vegetable oils liquid at room temperature while animal fats are solid?`, o: ['Oils are more unsaturated, so their molecules pack less closely', 'Oils have larger molecules', 'Oils contain water', 'Oils are not esters'], a: 0, e: `The C=C bonds put kinks in the chains, so they cannot pack together closely.`, w: ['', 'Molecule size is similar.', 'Oils do not contain water.', 'Oils and fats are both esters of glycerol.'] },
    { l: 4, q: `Starch is heated with dilute acid, then tested with Fehling's solution. A brick-red precipitate forms. Why?`, o: ['The starch has been hydrolysed to glucose', 'The acid is a reducing agent', 'Starch is a reducing sugar', 'The precipitate is copper'], a: 0, e: `Acid hydrolysis breaks starch into glucose, which reduces Fehling's solution.`, w: ['', 'The acid only breaks the starch down.', 'Starch alone gives no precipitate.', 'The precipitate is copper(I) oxide, Cu₂O.'] },
    { l: 5, q: `Glycerol, the alcohol in fats, is propane-1,2,3-triol. How many –OH groups does it have?`, o: ['3', '1', '2', '4'], a: 0, e: `"Triol" means three –OH groups, on carbons 1, 2 and 3.`, w: ['', 'That would be propanol.', 'That would be a diol.', 'Propane has only 3 carbons to carry them.'] },
    { l: 5, q: `Why do many plastics cause pollution?`, o: ['They are not biodegradable, and burning some releases toxic gases', 'They dissolve in rivers', 'They are radioactive', 'They are too heavy'], a: 0, e: `Microbes cannot break them down, and burning PVC releases HCl.`, w: ['', 'They do not dissolve.', 'They are not radioactive.', 'Their weight is not the problem.'] }
  ]
},

/* ───────────── RADIOACTIVITY ───────────── */
{
  id: 'c-nuc', name: 'Radioactivity and Nuclear Chemistry', sec: 'Section V · Organic and nuclear chemistry',
  goals: ['Describe alpha, beta and gamma radiation', 'Write balanced nuclear equations', 'Use half-life, and compare fission and fusion'],
  trap: `In alpha decay the mass number falls by 4 and the atomic number by 2. In beta decay the mass number stays the same and the atomic number rises by 1.`,
  parts: [
    {
      title: 'Types of radiation',
      idea: `Radioactive nuclei are unstable. They give out radiation to become more stable. There are three kinds: alpha particles, beta particles and gamma rays.`,
      rules: [
        `Alpha (α): a helium nucleus, ⁴₂He, charge +2. Highly ionising. Stopped by paper.`,
        `Beta (β): a fast electron, ⁰₋₁e, charge −1. Stopped by a few mm of aluminium.`,
        `Gamma (γ): electromagnetic radiation, no charge, no mass. Stopped only by thick lead or concrete.`
      ],
      ex: {
        q: `Radiation from a source passes through paper but is stopped by 3 mm of aluminium. What is it?`,
        steps: [
          [`It passes through paper`, `So it is not alpha.`],
          [`It is stopped by aluminium`, `Gamma would get through.`],
          [`It is beta radiation`, `Beta is stopped by a few mm of aluminium.`]
        ],
        why: [0, 'Why is alpha stopped so easily?', ['It is large and highly charged, so it loses its energy quickly by ionising', 'It moves faster than light', 'It has no charge'], ['Right.', 'Nothing moves faster than light.', 'Alpha has a charge of +2.']]
      },
      tryit: {
        q: `Which radiation is deflected towards the negative plate in an electric field?`,
        ask: `Choose the radiation.`, o: ['Alpha', 'Beta', 'Gamma', 'None of them'], a: 0,
        h: `Opposite charges attract.`, e: `Alpha particles are positive, so they bend towards the negative plate.`,
        fb: ['', 'Beta is negative, so it bends towards the positive plate.', 'Gamma has no charge, so it is not deflected.', 'Alpha and beta are both deflected.']
      }
    },
    {
      title: 'Nuclear equations and half-life',
      idea: `In a nuclear equation, the mass numbers on the top must balance, and so must the atomic numbers on the bottom. The half-life is the time for half of the radioactive nuclei in a sample to decay.`,
      g: DECAY, cap: `The mass halves every 2 days: 80 g, 40 g, 20 g, 10 g. The half-life is 2 days.`,
      rules: [
        `Alpha decay: ²²⁶₈₈Ra ${RA} ²²²₈₆Rn + ⁴₂He. Beta decay: ¹⁴₆C ${RA} ¹⁴₇N + ⁰₋₁e.`,
        `After n half-lives, the amount left is the original × (½)ⁿ.`,
        `Half-life does not depend on temperature, pressure or the amount present.`
      ],
      ex: {
        q: `A sample has a half-life of 5 days. What fraction is left after 20 days?`,
        steps: [
          [`Number of half-lives = 20 ÷ 5 = 4`, `Count the half-lives.`],
          [`Fraction left = (½)⁴`, `Halve four times.`],
          [`= ${fr(1, 16)}`, `So 15/16 has decayed.`]
        ],
        why: [1, 'Why (½)⁴ and not ½ × 4?', ['Each half-life halves what is left, so you halve four times in a row', 'Because 4 is even', 'Because half of 4 is 2'], ['Right: ½ → ¼ → ⅛ → 1/16.', 'Even or odd does not matter.', 'Halving four times is not the same as half of 4.']]
      },
      tryit: {
        q: `Complete the equation: ²³⁸₉₂U ${RA} ²³⁴₉₀Th + ?`,
        given: [`Mass: 238 = 234 + ?, so 4`, `Atomic number: 92 = 90 + ?, so 2`],
        ask: `So the particle is ?`, o: ['⁴₂He (alpha)', '⁰₋₁e (beta)', '¹₀n (neutron)', 'γ (gamma)'], a: 0,
        h: `Mass 4, charge 2.`, e: `A particle with mass 4 and atomic number 2 is an alpha particle.`,
        fb: ['', 'Beta has mass 0.', 'A neutron has atomic number 0.', 'Gamma has no mass.']
      }
    },
    {
      title: 'Fission, fusion and uses',
      idea: `Nuclear fission splits a heavy nucleus, such as uranium-235, into two smaller ones, releasing energy and neutrons. Nuclear fusion joins light nuclei, such as hydrogen, into heavier ones. Fusion powers the Sun.`,
      rules: [
        `Fission: a neutron hits ²³⁵U, which splits and releases 2 or 3 more neutrons, so a chain reaction can follow.`,
        `Fusion needs enormous temperatures, as in the Sun.`,
        `Uses: cobalt-60 to treat cancer, carbon-14 dating, tracers in industry and medicine, and nuclear power.`
      ],
      ex: {
        q: `Explain why a chain reaction can happen in uranium-235.`,
        steps: [
          [`One neutron splits one U-235 nucleus`, `Energy is released.`],
          [`The split releases 2 or 3 new neutrons`, `These can split more nuclei.`],
          [`The number of fissions grows rapidly`, `In a reactor, control rods absorb spare neutrons to keep it steady.`]
        ],
        why: [2, 'What do control rods do?', ['They absorb neutrons, so the chain reaction does not run out of control', 'They add more uranium', 'They cool the reactor'], ['Right.', 'They do the opposite: they slow the reaction.', 'A coolant does that.']]
      },
      tryit: {
        q: `Which process releases energy in the Sun?`,
        ask: `Choose the process.`, o: ['Nuclear fusion', 'Nuclear fission', 'Combustion', 'Alpha decay'], a: 0,
        h: `Hydrogen nuclei join to form helium.`, e: `In the Sun, hydrogen nuclei fuse into helium, releasing huge amounts of energy.`,
        fb: ['', 'Fission splits heavy nuclei.', 'There is no oxygen burning in the Sun.', 'Decay is not the main source.']
      }
    }
  ],
  spot: { part: 1, who: 'Ruth', q: `A 64 g sample has a half-life of 3 years. What mass is left after 9 years?`, lines: ['Number of half-lives = 9 ÷ 3 = 3', 'Mass left = 64 ÷ 3', 'Mass left = 21.3 g'], bad: 1,
    okfb: ['Three half-lives is right.', 'This follows from line 2.'],
    o: ['Halve three times: 64 → 32 → 16 → 8 g', 'She should multiply by 3', 'Half-life is 9 years', 'Nothing is wrong'],
    fb: ['That is it.', 'The mass goes down, not up.', 'The half-life is given as 3 years.', 'Dividing by 3 is not the same as halving 3 times.'],
    h: ['What happens to the mass in each half-life?'], fix: '64 × (½)³ = 8 g.' },
  qs: [
    { l: 1, q: `An alpha particle is the same as a`, o: ['helium nucleus', 'hydrogen atom', 'fast electron', 'neutron'], a: 0, e: `An alpha particle is 2 protons and 2 neutrons: ⁴₂He.`, w: ['', 'A hydrogen atom has 1 proton and 1 electron.', 'A fast electron is a beta particle.', 'A neutron is not ionising in the same way.'] },
    { l: 1, q: `Which radiation is the most penetrating?`, o: ['Gamma', 'Alpha', 'Beta', 'They are equal'], a: 0, e: `Gamma rays need thick lead or concrete to stop them.`, w: ['', 'Alpha is stopped by paper.', 'Beta is stopped by aluminium.', 'They differ greatly.'] },
    { l: 2, dx: 1, q: `A radioactive substance has a half-life of 2 days. What fraction is left after 6 days?`, o: [fr(1, 8), fr(1, 3), fr(1, 6), fr(1, 4)], a: 0, e: `6 ÷ 2 = 3 half-lives. (½)³ = ⅛.`, w: ['', 'Halve three times, do not divide by 3.', 'That divides by 6.', 'That is 2 half-lives.'] },
    { l: 2, q: `In beta decay, the atomic number`, o: ['increases by 1', 'decreases by 1', 'decreases by 2', 'stays the same'], a: 0, e: `A neutron turns into a proton and an electron. The proton stays, so Z rises by 1.`, w: ['', 'That is positron emission, not in the syllabus.', 'That is alpha decay.', 'It changes by 1.'] },
    { l: 2, q: `Which isotope is used to date old wood and bones?`, o: ['Carbon-14', 'Cobalt-60', 'Uranium-235', 'Iodine-131'], a: 0, e: `Living things take in carbon-14. After death it decays with a half-life of about 5730 years.`, w: ['', 'Cobalt-60 treats cancer.', 'Uranium-235 is a nuclear fuel.', 'Iodine-131 is used for the thyroid.'] },
    { l: 3, q: `From the decay curve, what is the half-life?`, g: DECAY, o: ['2 days', '4 days', '1 day', '8 days'], a: 0, e: `The mass falls from 80 g to 40 g in 2 days.`, w: ['', 'In 4 days the mass falls to a quarter.', 'After 1 day there is still about 57 g.', 'After 8 days only 5 g is left.'] },
    { l: 3, q: `What is X in ²²²₈₆Rn → X + ⁴₂He?`, o: ['²¹⁸₈₄Po', '²¹⁸₈₆Rn', '²²²₈₄Po', '²²⁶₈₈Ra'], a: 0, e: `Mass: 222 − 4 = 218. Atomic number: 86 − 2 = 84, which is polonium.`, w: ['', 'The atomic number must fall by 2 as well.', 'The mass number must fall by 4.', 'That is the reverse of the decay.'] },
    { l: 3, q: `Half-life of a radioactive isotope`, o: ['is not changed by heating it', 'gets shorter when it is heated', 'depends on how much is present', 'gets longer under pressure'], a: 0, e: `Nuclear decay is not affected by temperature, pressure or chemical change.`, w: ['', 'Heat does not affect nuclei.', 'The half-life is the same for any amount.', 'Pressure does not affect it.'] },
    { l: 4, q: `²³⁸₉₂U decays by one alpha and then two beta emissions. What is the final nucleus?`, o: ['²³⁴₉₂U', '²³⁴₉₀Th', '²³⁰₉₀Th', '²³⁴₉₄Pu'], a: 0, e: `Alpha: 234, 90. Two betas: mass stays 234, atomic number goes 91 then 92. Uranium-234.`, w: ['', 'That is after the alpha only.', 'The betas do not change the mass number.', 'Each beta raises Z by 1, not 2.'] },
    { l: 4, q: `A 120 g sample decays to 15 g in 24 hours. What is its half-life?`, o: ['8 hours', '3 hours', '12 hours', '6 hours'], a: 0, e: `120 → 60 → 30 → 15 is 3 half-lives. 24 ÷ 3 = 8 hours.`, w: ['', 'You divided 24 by 8. There are 3 half-lives.', 'That would be only 2 half-lives.', 'That would be 4 half-lives.'] },
    { l: 5, q: `How long does it take for 7/8 of a sample with a half-life of 10 years to decay?`, o: ['30 years', '70 years', '10 years', '80 years'], a: 0, e: `If 7/8 has decayed, 1/8 is left: 3 half-lives, 30 years.`, w: ['', '7/8 is not 7 half-lives.', 'After 10 years half has decayed, not 7/8.', '8 half-lives would leave 1/256.'] },
    { l: 5, q: `Why is nuclear fusion hard to achieve on Earth?`, o: ['It needs extremely high temperatures to overcome the repulsion between nuclei', 'There is no hydrogen on Earth', 'It releases too little energy', 'It needs uranium'], a: 0, e: `Nuclei are positive and repel each other, so they must collide at enormous speeds.`, w: ['', 'Hydrogen is plentiful, in water.', 'It releases a huge amount of energy.', 'Fusion uses light nuclei, not uranium.'] }
  ]
}
);

QG['c-nuc'] = [
  { l: 3, n: 4, f: R => {
    const h = R.pick([2, 3, 5, 6, 8, 10]), n = R.pick([2, 3, 4]), m0 = R.pick([16, 32, 48, 64, 80, 96, 128, 160]), t = h * n, m = m0 / 2 ** n;
    if (m !== Math.round(m * 100) / 100) return null;
    return { q: `A radioactive isotope has a half-life of ${h} days. What mass of a ${m0} g sample is left after ${t} days?`, o: [s3(m) + ' g', s3(m0 / n) + ' g', s3(m0 - m) + ' g', s3(m0 / 2 ** (n - 1)) + ' g'],
      w: ['', `You divided by ${n}. Halve ${n} times instead.`, 'That is the mass that has decayed, not the mass left.', `That is only ${n - 1} half-lives. ${t} ÷ ${h} = ${n}.`],
      e: `${t} ÷ ${h} = ${n} half-lives. ${m0} × (½)<sup>${n}</sup> = ${s3(m)} g.` };
  } }
];

/* Chemistry calculations made from seeded numbers. The code works out the right answer, and each wrong
   option is a real mistake: forgetting to change units, using the wrong ratio, dividing the wrong way round. */
const s3 = x => { const v = Number(Number(x).toPrecision(3)); return Math.abs(v) >= 1e5 || (Math.abs(v) < 1e-3 && v) ? sci(v) : String(v); };
const sci = x => { const e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e; return `${Number(m.toPrecision(3))} × 10<sup>${e < 0 ? '−' + -e : e}</sup>`; };
const CMP = [['H2O', 18], ['CO2', 44], ['NaOH', 40], ['NaCl', 58.5], ['CaCO3', 100], ['H2SO4', 98], ['NH3', 17], ['CH4', 16], ['MgO', 40], ['KOH', 56], ['Na2CO3', 106], ['HCl', 36.5]];
const GAS = [['O2', 32], ['N2', 28], ['CO2', 44], ['CH4', 16], ['SO2', 64], ['NH3', 17], ['H2', 2], ['Cl2', 71]];

QG['c-mole'] = [
  { l: 2, n: 4, f: R => {
    const [f, M] = R.pick(CMP), n = R.pick([0.1, 0.2, 0.25, 0.4, 0.5, 1.5, 2, 2.5]), m = +(n * M).toFixed(2);
    return { q: `How many moles are in ${m} g of ${ch(f)}? (M<sub>r</sub> = ${M})`, o: [s3(n), s3(M / m), s3(m * M), s3(n / 10)],
      w: ['', 'You divided the molar mass by the mass. Moles = mass ÷ molar mass.', 'You multiplied. Divide the mass by the molar mass.', 'Check the decimal point in your division.'],
      e: `Moles = mass ÷ molar mass = ${m} ÷ ${M} = ${s3(n)} mol.` };
  } },
  { l: 2, n: 3, f: R => {
    const [f, M] = R.pick(GAS), n = R.pick([0.1, 0.2, 0.25, 0.5, 1.5, 2]), m = +(n * M).toFixed(2), V = n * 22.4;
    return { q: `What volume does ${m} g of ${ch(f)} occupy at s.t.p.? (M<sub>r</sub> = ${M}, molar volume = 22.4 dm³)`, o: [s3(V) + ' dm³', s3(m * 22.4) + ' dm³', s3(n * 24) + ' dm³', s3(22.4 / n) + ' dm³'],
      w: ['', 'You multiplied the mass by 22.4. Change grams to moles first.', 'At s.t.p. the molar volume is 22.4 dm³. 24 dm³ is at room temperature.', 'You divided 22.4 by the moles. Multiply.'],
      e: `Moles = ${m} ÷ ${M} = ${n} mol. Volume = ${n} × 22.4 = ${s3(V)} dm³.` };
  } },
  { l: 3, n: 4, f: R => {
    const [f, M] = R.pick(CMP.filter(x => !['CaCO3', 'MgO'].includes(x[0]))), c = R.pick([0.05, 0.1, 0.2, 0.25, 0.4, 0.5, 1]), V = R.pick([100, 200, 250, 500]), m = +(c * M * V / 1000).toFixed(3);
    return { q: `${m} g of ${ch(f)} is dissolved to make ${V} cm³ of solution. What is its concentration? (M<sub>r</sub> = ${M})`, o: [s3(c) + ' mol dm⁻³', s3(m / M / V) + ' mol dm⁻³', s3(m / (V / 1000)) + ' mol dm⁻³', s3(m / M * V / 1000) + ' mol dm⁻³'],
      w: ['', 'You divided by the volume in cm³. Change it to dm³ first.', 'That is the mass concentration in g dm⁻³. Divide by the molar mass too.', 'You multiplied by the volume. Divide by it.'],
      e: `Moles = ${m} ÷ ${M} = ${s3(m / M)} mol. Volume = ${V / 1000} dm³. Concentration = ${s3(m / M)} ÷ ${V / 1000} = ${s3(c)} mol dm⁻³.` };
  } },
  { l: 3, n: 3, f: R => {
    const [f, M] = R.pick(CMP), n = R.pick([0.1, 0.2, 0.5, 2, 3]), m = +(n * M).toFixed(2), N = n * 6.02e23;
    return { q: `How many molecules are in ${m} g of ${ch(f)}? (M<sub>r</sub> = ${M}, L = 6.02 × 10²³)`, o: [sci(N), sci(m * 6.02e23), sci(6.02e23 / n), sci(N / 10)],
      w: ['', 'You multiplied the mass by L. Change grams to moles first.', 'You divided L by the moles. Multiply.', 'Check the power of ten.'],
      e: `Moles = ${m} ÷ ${M} = ${n}. Molecules = ${n} × 6.02 × 10²³ = ${sci(N)}.` };
  } }
];

QG['c-vol'] = [
  { l: 2, n: 3, f: R => {
    const c = R.pick([0.05, 0.1, 0.15, 0.2, 0.25]), V = R.pick([10, 20, 25, 50]), n = c * V / 1000;
    return { q: `How many moles of solute are in ${V}.0 cm³ of a ${c} mol dm⁻³ solution?`, o: [s3(n) + ' mol', s3(c * V) + ' mol', s3(c / V) + ' mol', s3(V / c / 1000) + ' mol'],
      w: ['', 'You used the volume in cm³. Change it to dm³ first.', 'You divided the concentration by the volume. Multiply.', 'You divided the volume by the concentration. Multiply them.'],
      e: `Moles = ${c} × ${V} ÷ 1000 = ${s3(n)} mol.` };
  } },
  { l: 3, n: 4, f: R => {
    const cb = R.pick([0.1, 0.12, 0.15, 0.2]), Vb = 25, Va = R.pick([16, 18.75, 20, 22.5, 25, 30, 31.25]), ca = cb * Vb / Va;
    const acid = R.pick(['HCl', 'HNO3']), base = R.pick(['NaOH', 'KOH']);
    if (Math.abs(ca - cb) < 1e-9) return null;
    return { q: `${Vb}.0 cm³ of ${cb} mol dm⁻³ ${ch(base)} is neutralised by ${Va} cm³ of ${ch(acid)}. Find the concentration of the acid. (The ratio is 1 : 1.)`, o: [s3(ca) + ' mol dm⁻³', s3(cb * Va / Vb) + ' mol dm⁻³', s3(cb) + ' mol dm⁻³', s3(ca / 2) + ' mol dm⁻³'],
      w: ['', 'You put the volumes the wrong way round. Moles of base ÷ volume of acid.', 'Different volumes reacted, so the concentrations are different.', 'The ratio is 1 : 1, so do not halve.'],
      e: `Moles of base = ${cb} × ${Vb} ÷ 1000 = ${s3(cb * Vb / 1000)} mol = moles of acid. C = ${s3(cb * Vb / 1000)} ÷ ${s3(Va / 1000)} = ${s3(ca)} mol dm⁻³.` };
  } },
  { l: 4, n: 4, f: R => {
    const cb = R.pick([0.1, 0.2, 0.25, 0.3]), Vb = 25, Va = R.pick([12.5, 15, 20, 25, 31.25]), nb = cb * Vb / 1000, na = nb / 2, ca = na / (Va / 1000);
    return { q: `${Vb}.0 cm³ of ${cb} mol dm⁻³ NaOH is neutralised by ${Va} cm³ of H₂SO₄. H₂SO₄ + 2NaOH ${RA} Na₂SO₄ + 2H₂O. Find the concentration of the acid.`, o: [s3(ca) + ' mol dm⁻³', s3(ca * 2) + ' mol dm⁻³', s3(ca * 4) + ' mol dm⁻³', s3(na / (Vb / 1000)) + ' mol dm⁻³'],
      w: ['', 'You used a 1 : 1 ratio. One H₂SO₄ reacts with two NaOH.', 'You doubled instead of halving.', 'Divide the moles of acid by the volume of acid, not of the base.'],
      e: `Moles of NaOH = ${cb} × 0.0250 = ${s3(nb)} mol. Moles of H₂SO₄ = ${s3(nb)} ÷ 2 = ${s3(na)} mol. C = ${s3(na)} ÷ ${s3(Va / 1000)} = ${s3(ca)} mol dm⁻³.` };
  } }
];

QG['c-elec'] = [
  { l: 3, n: 3, f: R => {
    const I = R.pick([0.5, 1.5, 2, 2.5, 3, 4, 5]), min = R.pick([5, 10, 15, 20, 30]), Q = I * min * 60;
    return { q: `What charge passes when a current of ${I} A flows for ${min} minutes?`, o: [`${s3(Q)} C`, `${s3(I * min)} C`, `${s3(Q / 96500)} C`, `${s3(I * min * 100)} C`],
      w: ['', 'Time must be in seconds.', 'That is the number of faradays, not coulombs.', 'There are 60 seconds in a minute, not 100.'],
      e: `t = ${min} × 60 = ${min * 60} s. Q = It = ${I} × ${min * 60} = ${s3(Q)} C.` };
  } },
  { l: 4, n: 5, f: R => {
    const [sym, M, z, name] = R.pick([['Cu', 63.5, 2, 'copper(II) sulphate'], ['Ag', 108, 1, 'silver nitrate'], ['Zn', 65, 2, 'zinc sulphate'], ['Ni', 59, 2, 'nickel(II) sulphate'], ['Al', 27, 3, 'molten aluminium oxide']]);
    const I = R.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]), min = R.pick([10, 16, 20, 30, 32, 40, 60]), t = min * 60, Q = I * t, m = Q / 96500 / z * M;
    return { q: `A current of ${I} A flows for ${min} minutes through ${name}. What mass of ${sym === 'Cu' ? 'copper' : sym === 'Ag' ? 'silver' : sym === 'Zn' ? 'zinc' : sym === 'Ni' ? 'nickel' : 'aluminium'} is deposited? (${sym} = ${M}, F = 96 500 C)`,
      o: [s3(m) + ' g', z > 1 ? s3(m * z) + ' g' : s3(m * 2) + ' g', s3(m / 60) + ' g', s3(m / z / z) + ' g'],
      w: ['', z > 1 ? `You forgot that each ${sym}${z === 2 ? '²' : '³'}⁺ ion needs ${z} electrons.` : 'Ag⁺ needs only one electron per atom.', 'Time must be in seconds, not minutes.', `You divided by ${z} twice.`],
      e: `Q = ${I} × ${t} = ${s3(Q)} C. Moles of e⁻ = ${s3(Q)} ÷ 96 500 = ${s3(Q / 96500)}. Moles of ${sym} = ${s3(Q / 96500)} ÷ ${z} = ${s3(Q / 96500 / z)}. Mass = ${s3(Q / 96500 / z)} × ${M} = ${s3(m)} g.` };
  } }
];

QG['c-kin'] = [
  { l: 3, n: 4, f: R => {
    const V1 = R.pick([100, 150, 200, 250, 300, 400]), c1 = R.pick([7, 17, 27, 47, 77]), c2 = R.pick([57, 87, 127, 177, 227, 37]), T1 = c1 + 273, T2 = c2 + 273, V2 = V1 * T2 / T1;
    if (c1 === c2) return null;
    return { q: `A gas occupies ${V1} cm³ at ${c1} °C. What is its volume at ${c2 < 0 ? '−' + -c2 : c2} °C, at constant pressure?`, o: [s3(V2) + ' cm³', s3(V1 * c2 / c1) + ' cm³', s3(V1 * T1 / T2) + ' cm³', s3(V1 + (c2 - c1)) + ' cm³'],
      w: ['', 'You used °C. Change both temperatures to kelvin.', 'You turned the temperatures upside down. A hotter gas is bigger.', 'Volume is proportional to temperature. It does not go up by one cm³ per degree.'],
      e: `T₁ = ${T1} K, T₂ = ${T2} K. V₂ = ${V1} × ${T2} ÷ ${T1} = ${s3(V2)} cm³.` };
  } },
  { l: 3, n: 3, f: R => {
    const P1 = R.pick([100, 120, 150, 200]), V1 = R.pick([60, 80, 120, 150, 240]), P2 = R.pick([50, 75, 300, 400, 600]), V2 = P1 * V1 / P2;
    return { q: `A gas has a volume of ${V1} cm³ at ${P1} kPa. Find its volume at ${P2} kPa, at constant temperature.`, o: [s3(V2) + ' cm³', s3(V1 * P2 / P1) + ' cm³', s3(V1) + ' cm³', s3(P1 * P2 / V1) + ' cm³'],
      w: ['', 'You turned the pressures upside down. Higher pressure means smaller volume.', 'The pressure changed, so the volume must change.', 'Use P₁V₁ = P₂V₂.'],
      e: `P₁V₁ = P₂V₂, so V₂ = ${P1} × ${V1} ÷ ${P2} = ${s3(V2)} cm³.` };
  } },
  { l: 4, n: 3, f: R => {
    const V1 = R.pick([200, 300, 400, 500]), c1 = R.pick([27, 7, 17]), P1 = R.pick([1, 2]), c2 = R.pick([127, 77, 227]), P2 = R.pick([2, 3, 4]), T1 = c1 + 273, T2 = c2 + 273, V2 = V1 * P1 * T2 / (P2 * T1);
    if (P1 === P2) return null;
    return { q: `A gas occupies ${V1} cm³ at ${c1} °C and ${P1} atm. Find its volume at ${c2} °C and ${P2} atm.`, o: [s3(V2) + ' cm³', s3(V1 * P2 * T2 / (P1 * T1)) + ' cm³', s3(V1 * P1 * c2 / (P2 * c1)) + ' cm³', s3(V1 * P1 / P2) + ' cm³'],
      w: ['', 'You turned the pressure ratio upside down.', 'You used °C. Use kelvin.', 'You allowed for the pressure but not the temperature.'],
      e: `${fr('P₁V₁', 'T₁')} = ${fr('P₂V₂', 'T₂')}, so V₂ = ${V1} × ${fr(P1, P2)} × ${fr(T2, T1)} = ${s3(V2)} cm³.` };
  } }
];

const TEACH: Record<string, any[][]> = {};
TEACH['c-sep'] = [

/* Part 1: elements, compounds and mixtures */
[
  { k: 'teach', title: 'Everything is made of elements', body: [
    ['p', `Look around you: water, salt, air, a spoon, your own body. Chemists ask one question about each of them. <b>What is it made of?</b>`],
    ['p', `All matter is built from tiny particles called atoms. There are only about 118 different kinds of atom. A substance that contains <b>only one kind of atom</b> is called an <b>element</b>.`],
    ['eg', 'Examples', `Iron is an element: every atom in a pure iron nail is an iron atom. Oxygen, hydrogen, carbon, gold, copper, sulphur and sodium are also elements.`],
    ['p', `Because an element has only one kind of atom, there is nothing simpler inside it to take out. However you heat it or react it, you cannot break it down into a simpler substance. That is the test of an element.`],
    ['p', `Each element has a symbol of one or two letters: H for hydrogen, O for oxygen, Fe for iron, Na for sodium, Cl for chlorine.`],
    ['key', `An element contains one kind of atom only. It cannot be split into anything simpler by a chemical process.`]
  ] },
  { k: 'teach', title: 'Compounds: elements joined together', body: [
    ['p', `Most substances are not elements. When two or more elements <b>react</b>, their atoms join together and a completely new substance forms. That new substance is a <b>compound</b>.`],
    ['eg', 'Water', `Hydrogen is a gas that burns with a pop. Oxygen is a gas that makes things burn faster. When they react they form water, a liquid that puts fire out. Water behaves like neither of the elements inside it.`],
    ['eg', 'Table salt', `Sodium is a soft metal that reacts violently with water. Chlorine is a poisonous green gas. Joined together they form sodium chloride, the salt you eat.`],
    ['p', `These two examples show the three things that are true of every compound:`],
    ['ol', [
      `<b>It has new properties.</b> A compound does not behave like the elements it is made from.`,
      `<b>Its composition is fixed.</b> Water is always H₂O. In every sample, from a river or from a laboratory, 1 g of hydrogen is combined with 8 g of oxygen. You cannot make water with a little extra hydrogen in it.`,
      `<b>It can only be separated by a chemical reaction.</b> The elements are chemically joined, so filtering or boiling will not pull them apart. To get hydrogen and oxygen back from water you must pass electricity through it.`
    ]],
    ['p', `Heat is usually given out or taken in when a compound forms. That energy change is a sign that a chemical reaction has happened.`]
  ] },
  { k: 'check', title: 'Check that you have it', q: `Which statement about a compound is correct?`, o: [`Its elements are always combined in the same ratio by mass`, `It keeps the properties of the elements in it`, `It can be separated by filtering`, `It contains only one kind of atom`], a: 0,
    fb: [`Yes. Fixed composition is what makes it a compound: water is always 1 g of hydrogen to 8 g of oxygen.`, `A compound has new properties. Water is nothing like hydrogen or oxygen.`, `Filtering is a physical method. The elements in a compound are chemically joined, so only a chemical reaction separates them.`, `One kind of atom describes an element. A compound has two or more elements.`],
    h: [`Think of water. Is it ever made with a different amount of hydrogen?`] },
  { k: 'teach', title: 'Mixtures: together but not joined', body: [
    ['p', `Now stir some sand into a cup of garri. Nothing reacts. The sand is still sand and the garri is still garri. They are in the same cup, but they are not chemically joined. This is a <b>mixture</b>.`],
    ['p', `Three things are true of every mixture, and each one is the opposite of a compound:`],
    ['ol', [
      `<b>Each part keeps its own properties.</b> The garri still tastes like garri. The sand is still gritty.`,
      `<b>The composition can be anything.</b> One spoon of sand or ten, it is still a mixture of sand and garri.`,
      `<b>It can be separated by physical methods</b> such as sieving, filtering or boiling, because nothing has to be broken apart chemically.`
    ]],
    ['eg', 'Mixtures you already know', `Air (mainly nitrogen and oxygen), sea water (water, salt and other dissolved solids), crude oil, soil, zobo, and alloys such as brass (copper and zinc).`],
    ['tb', ['', 'Compound', 'Mixture'], [
      ['How it forms', 'By a chemical reaction', 'By simply mixing'],
      ['Composition', 'Fixed ratio by mass', 'Any proportion'],
      ['Properties', 'New, unlike its elements', 'Each part keeps its own'],
      ['Energy change', 'Heat given out or taken in', 'Usually none'],
      ['Separated by', 'Chemical means only', 'Physical methods'],
      ['Formula', 'Has one, e.g. H₂O', 'None']
    ]],
    ['wn', `"Air is a compound of nitrogen and oxygen." It is not. The gases in air are not chemically joined, the proportions vary from place to place, and air can be separated physically. Air is a mixture.`]
  ] },
  { k: 'teach', title: 'Pure or impure? Physical or chemical change?', body: [
    ['h', `How to tell if a substance is pure`],
    ['p', `A pure substance, whether an element or a compound, melts at one exact temperature and boils at one exact temperature. Pure ice melts at 0 °C. Pure water boils at 100 °C at normal pressure.`],
    ['p', `An impurity changes both numbers:`],
    ['li', [`it <b>lowers the melting point</b>, and the solid melts gradually over a range of temperatures;`, `it <b>raises the boiling point</b>.`]],
    ['eg', 'Everyday proof', `Salt water boils above 100 °C and freezes below 0 °C. That is why a chemist checks purity with a melting point or a boiling point, never by looking. A liquid can be clear and colourless and still be impure.`],
    ['h', `Two kinds of change`],
    ['p', `Separating a mixture is a <b>physical change</b>: no new substance is made. Forming a compound is a <b>chemical change</b>: a new substance is made. JAMB often asks you to tell them apart.`],
    ['tb', ['', 'Physical change', 'Chemical change'], [
      ['New substance?', 'No', 'Yes'],
      ['Reversed easily?', 'Yes', 'Not easily'],
      ['Heat change', 'Small or none', 'Usually large'],
      ['Examples', 'Melting ice, dissolving salt in water, boiling water, magnetising iron, iodine subliming', 'Rusting of iron, burning wood, souring of milk, fermenting palm wine, cooking an egg']
    ]],
    ['key', `Ask one question: "Has a new substance been formed?" If yes, the change is chemical. If no, it is physical.`]
  ] },
  { k: 'check', title: 'Check that you have it', q: `Which of these is a chemical change?`, o: [`Rusting of an iron nail`, `Melting of candle wax`, `Dissolving sugar in water`, `Evaporation of petrol`], a: 0,
    fb: [`Yes. Rust is a new substance, hydrated iron(III) oxide, and you cannot simply turn it back into iron.`, `Melted wax is still wax. It becomes solid again when it cools.`, `The sugar is still there and can be recovered by evaporating the water. No new substance forms.`, `Petrol vapour is still petrol. Only its state has changed.`],
    h: [`In which one does a new substance form?`] }
],

/* Part 2: methods for a solid and a liquid */
[
  { k: 'teach', title: 'The one idea behind every method', body: [
    ['p', `There are more than ten separation methods in the syllabus. You do not need to memorise them as a list. Every one of them works the same way:`],
    ['key', `Find a <b>physical property</b> in which the parts of the mixture are different. Then use the method that takes advantage of that difference.`],
    ['p', `Start with the simplest methods. You have seen all of them at home.`],
    ['tb', ['Method', 'The difference it uses', 'Example'], [
      ['Sieving', 'Size of the solid particles', 'Sieving garri; separating gravel from sand'],
      ['Magnetic separation', 'Only one part is attracted by a magnet', 'Iron filings from sulphur; iron from scrap'],
      ['Decantation', 'A heavy solid settles; the liquid is poured off', 'Pouring water off washed rice; clear water off settled mud'],
      ['Centrifugation', 'Fine solid is spun to the bottom of a tube', 'Blood cells from blood plasma']
    ]],
    ['p', `Decantation is quick but not clean, because some liquid stays with the solid. Centrifugation is used when the solid particles are too fine to settle on their own. A machine spins the tube very fast and the solid is forced to the bottom.`]
  ] },
  { k: 'teach', title: 'Filtration', body: [
    ['p', `<b>Use it for:</b> a solid that does <b>not</b> dissolve, mixed with a liquid. Sand in water is the standard example.`],
    ['p', `<b>Why it works:</b> filter paper has holes too small to see. Water particles are tiny and pass through. Grains of sand are far too big and are trapped.`],
    ['fig', ['app', { kind: 'filter', label: 'Filtration: a funnel with filter paper over a beaker' }], `The solid left on the paper is the residue. The liquid that passes through is the filtrate.`],
    ['li', [`<b>Residue:</b> the insoluble solid left on the filter paper.`, `<b>Filtrate:</b> the clear liquid collected below.`]],
    ['eg', 'At home', `Straining pap (akamu) through a cloth is filtration. So is the sand filter bed at a water treatment works.`],
    ['wn', `Filtration cannot remove a <b>dissolved</b> solid. Filter salt water and the filtrate is still salty, because dissolved salt particles are as small as water particles and pass straight through the paper.`]
  ] },
  { k: 'teach', title: 'Getting a dissolved solid back', body: [
    ['p', `A dissolved solid passes through filter paper, so a different difference is needed. The water can be turned into vapour by heating. The solid cannot. So drive the water off and the solid stays behind.`],
    ['h', `Evaporation to dryness`],
    ['fig', ['app', { kind: 'evap' }], `The solution is heated until all the water has gone. The solid is left in the basin.`],
    ['p', `Heat the solution in an evaporating basin until all the water has gone. This is how salt is obtained from sea water. Use it only for solids that heat does not damage, such as sodium chloride.`],
    ['h', `Crystallisation`],
    ['p', `Some salts are spoiled by strong heating. Blue copper(II) sulphate crystals, CuSO₄·5H₂O, hold water inside the crystal, called <b>water of crystallisation</b>. Heat them to dryness and that water is driven off, leaving a white powder. For salts like this, crystallise instead:`],
    ['ol', [
      `Heat the solution gently to drive off some of the water, until it is <b>saturated</b>. To test, dip a glass rod in and take it out. If crystals form on the rod as it cools, the solution is ready.`,
      `Leave it to <b>cool slowly</b>. Crystals form, because less solid can stay dissolved in cold water.`,
      `<b>Filter</b> to collect the crystals.`,
      `<b>Wash</b> them with a little cold distilled water and <b>dry</b> them between filter papers.`
    ]],
    ['h', `Two related methods`],
    ['li', [
      `<b>Fractional crystallisation</b> separates two dissolved solids whose solubilities change differently with temperature. As the hot solution cools, the less soluble solid crystallises first and is filtered off.`,
      `<b>Precipitation</b> separates a dissolved solid by adding a second liquid in which the solid does not dissolve. For example, adding ethanol to a solution of iron(II) sulphate in water makes the salt come out as a solid.`
    ]]
  ] },
  { k: 'teach', title: 'Getting the liquid back: distillation', body: [
    ['p', `Evaporation keeps the solid and loses the water into the air. What if the <b>liquid</b> is what you want, such as pure water from sea water? Then the vapour must be caught and turned back into liquid. That is <b>distillation</b>: boiling followed by condensing.`],
    ['fig', ['app', { kind: 'distil' }], `The water boils, its vapour passes into the cold condenser, turns back to liquid and drips into the beaker. The salt stays behind in the flask.`],
    ['ol', [
      `The solution is boiled in the flask. Only the water turns to vapour. The salt stays behind.`,
      `The vapour enters the <b>condenser</b>, a tube surrounded by a jacket of cold running water.`,
      `The vapour cools, condenses to liquid and drips into the receiver. This pure liquid is the <b>distillate</b>.`
    ]],
    ['p', `Two details that examiners like:`],
    ['li', [
      `Cold water enters the condenser at the <b>bottom</b> and leaves at the <b>top</b>. This keeps the jacket full of cold water, so the condenser cools well along its whole length.`,
      `The bulb of the thermometer sits level with the side arm, so it reads the temperature of the vapour about to enter the condenser. For pure water it reads 100 °C.`
    ]],
    ['key', `Want the solid? Evaporate or crystallise. Want the liquid? Distil.`]
  ] },
  { k: 'check', title: 'Check that you have it', q: `A student wants dry, pure crystals of copper(II) sulphate from its solution. Which method should she use?`, o: [`Crystallisation`, `Evaporation to dryness`, `Filtration only`, `Simple distillation`], a: 0,
    fb: [`Yes. Heat until the solution is saturated, cool, then filter, wash and dry the crystals.`, `Heating to dryness drives off the water of crystallisation and leaves a white powder instead of blue crystals.`, `The salt is dissolved, so it would pass straight through the filter paper.`, `Distillation collects the water. She wants the solid.`],
    h: [`The blue crystals contain water of crystallisation. What does strong heating do to them?`] }
],

/* Part 3: two liquids, sublimation and chromatography */
[
  { k: 'teach', title: 'Separating two liquids', body: [
    ['p', `With two liquids, first ask: <b>do they mix?</b>`],
    ['h', `They do not mix: use a separating funnel`],
    ['p', `Liquids that do not mix, such as palm oil and water or kerosene and water, are called <b>immiscible</b>. Left to stand they form two layers. The denser liquid sinks to the bottom.`],
    ['fig', ['app', { kind: 'sepf' }], `Open the tap and run off the lower layer. Close it just as the boundary between the layers reaches the tap.`],
    ['ol', [`Pour the mixture into the funnel and let it settle into two layers.`, `Remove the stopper and open the tap. The lower, denser layer runs out.`, `Close the tap when the boundary reaches it. The upper layer stays in the funnel.`]],
    ['h', `They mix: use fractional distillation`],
    ['p', `Liquids that mix completely, such as ethanol and water, are <b>miscible</b>. There are no layers to run off. But the two liquids boil at different temperatures: ethanol at 78 °C and water at 100 °C. That difference is what you use.`],
    ['fig', ['app', { kind: 'frac' }], `The column is packed with glass beads. Ethanol vapour reaches the top first.`],
    ['p', `When the mixture is heated, both liquids give off vapour. The vapours rise into the <b>fractionating column</b>. Water vapour, with the higher boiling point, condenses on the beads and runs back into the flask. Ethanol vapour, with the lower boiling point, reaches the top, passes into the condenser and is collected first.`],
    ['p', `The thermometer stays at 78 °C while ethanol is coming over. When it starts to rise, the ethanol is finished and the receiver is changed.`],
    ['eg', 'Where it is used', `Refining crude oil into petrol, kerosene, diesel and bitumen. Separating liquid air into nitrogen (boils at −196 °C, comes off first) and oxygen (−183 °C). Getting ethanol from fermented palm wine.`],
    ['wn', `Do not mix up the two distillations. <b>Simple</b> distillation gets a liquid back from a dissolved solid. <b>Fractional</b> distillation separates miscible liquids whose boiling points are different.`]
  ] },
  { k: 'check', title: 'Check that you have it', q: `Which pair of liquids can be separated with a separating funnel?`, o: [`Kerosene and water`, `Ethanol and water`, `Petrol and kerosene`, `Sugar solution and water`], a: 0,
    fb: [`Yes. They do not mix, so they form two layers, with the kerosene on top.`, `Ethanol and water mix completely, so there are no layers. Use fractional distillation.`, `These mix with each other. They are separated by fractional distillation of crude oil.`, `These mix completely. A separating funnel needs two layers.`],
    h: [`A separating funnel only works when you can see two layers.`] },
  { k: 'teach', title: 'Sublimation', body: [
    ['p', `Most solids melt to a liquid before they boil. A few change <b>straight from solid to gas</b> when heated, and straight back to solid when cooled. This is <b>sublimation</b>.`],
    ['eg', 'Solids that sublime', `Iodine, ammonium chloride, camphor (naphthalene balls) and solid carbon dioxide (dry ice). Learn these four.`],
    ['p', `If only one solid in a mixture sublimes, heating separates them. Take ammonium chloride mixed with sodium chloride:`],
    ['fig', ['app', { kind: 'subl' }], `The ammonium chloride leaves the dish as vapour and re-forms on the cool funnel. The sodium chloride stays in the dish.`],
    ['ol', [`Heat the mixture gently in a dish under an inverted funnel.`, `The ammonium chloride turns to vapour and rises.`, `On the cool inside of the funnel it turns back to a solid, called the <b>sublimate</b>.`, `The sodium chloride does not sublime. It is left in the dish.`]]
  ] },
  { k: 'teach', title: 'Chromatography', body: [
    ['p', `Black ink looks like one colour. It is usually a mixture of several dyes. <b>Chromatography</b> separates dissolved coloured substances like these, even when the amounts are very small.`],
    ['h', `How to do it`],
    ['ol', [
      `Draw a start line in <b>pencil</b> near the bottom of a strip of filter paper. Put a small spot of the mixture on the line.`,
      `Stand the paper in a little solvent, with the solvent level <b>below</b> the start line.`,
      `The solvent soaks up the paper and carries the dyes with it.`,
      `Take the paper out when the solvent is near the top. Mark how far it reached. This is the <b>solvent front</b>.`
    ]],
    ['h', `Why the dyes separate`],
    ['p', `Each dye is pulled two ways: the moving solvent carries it up, and the paper holds it back. A dye that dissolves well in the solvent and clings weakly to the paper travels far. A dye that clings strongly to the paper travels a short distance. So each dye ends at a different height.`],
    ['fig', ['app', { kind: 'chrom' }], `The mixture has separated into two spots. They are level with the spots of dye A and dye B, so the mixture contains A and B and does not contain C.`],
    ['h', `How to read a chromatogram`],
    ['li', [`<b>One spot</b>: the substance is pure, a single dye.`, `<b>Two or more spots</b>: it is a mixture, with one dye for each spot.`, `<b>Spots at the same height</b> are the same substance. This is how an unknown dye is identified.`]],
    ['h', `The R<sub>f</sub> value`],
    ['p', `R<sub>f</sub> = distance moved by the spot ÷ distance moved by the solvent front. Both distances are measured from the start line. The spot can never overtake the solvent, so R<sub>f</sub> is always less than 1. Each substance has its own R<sub>f</sub> value in a given solvent.`],
    ['wn', `Two errors spoil a chromatogram. Drawing the start line in ink: the ink dissolves and runs with the sample. Letting the solvent cover the start line: the spots wash off into the solvent instead of travelling up the paper.`]
  ] },
  { k: 'teach', title: 'Choosing the right method', body: [
    ['p', `You now have every method in the syllabus. In the exam, do not guess from the name of the mixture. Ask what is different about its parts, then read off the method.`],
    ['tb', ['The mixture', 'What is different', 'Method'], [
      ['Solids of different sizes', 'Particle size', 'Sieving'],
      ['Iron with a non-magnetic solid', 'Attraction to a magnet', 'Magnetic separation'],
      ['Insoluble solid in a liquid', 'Particle size', 'Filtration (or decantation, centrifugation)'],
      ['Dissolved solid, solid wanted', 'Only the liquid turns to vapour', 'Evaporation, or crystallisation if heat spoils it'],
      ['Dissolved solid, liquid wanted', 'Only the liquid turns to vapour', 'Simple distillation'],
      ['Two liquids that mix', 'Boiling point', 'Fractional distillation'],
      ['Two liquids that do not mix', 'Density (two layers)', 'Separating funnel'],
      ['A solid that sublimes with one that does not', 'Only one sublimes', 'Sublimation'],
      ['Dissolved dyes or pigments', 'Speed of travel over paper', 'Chromatography']
    ]],
    ['eg', 'Using two methods together', `Salt mixed with sand: add water (the salt dissolves), filter (the sand is the residue), then evaporate the filtrate (the salt is left). Many exam questions need two or three methods in the right order.`]
  ] }
]
];

function chemPrep(topics: Topic[]): Topic[] {
  return topics.map(orig => ({
    ...orig,
    qs: orig.qs.map((q, i) => {
      if (q.gen) return q;
      const p = perm(`${orig.id}#${i}`, q.o.length);
      return Object.assign({}, q, {
        q: mfix(q.q),
        o: p.map(k => mfix(q.o[k])),
        a: p.indexOf(q.a),
        w: q.w ? p.map(k => q.w[k] || "") : undefined,
        e: mfix(q.e),
      });
    }),
  }));
}

function applyChemGenerators(topics: Topic[]): Topic[] {
  return topics.map(orig => {
    const t = { ...orig, qs: orig.qs.slice() };
    const gens = [...(QG[t.id] || []), ...(CHEM_2027_EXTRA_QG[t.id] || [])];
    gens.forEach((T, k) => {
      let made = 0;
      for (let v = 0; made < (T.n || 3) && v < 60; v++) {
        let q: any;
        try { q = T.f(mkR(`${t.id}|${k}|${v}`)); } catch { q = null; }
        if (!q) continue;
        const keys = q.o.map((x: any) => String(x).replace(/<[^>]+>/g, "").replace(/\s+/g, ""));
        if (new Set(keys).size !== keys.length || t.qs.some(x => x.q === q.q)) continue;
        const p = perm(`${t.id}~${k}~${v}`, q.o.length);
        t.qs.push({
          l: T.l,
          q: mfix(q.q),
          g: q.g,
          o: p.map(i => mfix(q.o[i])),
          a: p.indexOf(0),
          w: q.w ? p.map(i => mfix(q.w[i] || "")) : undefined,
          e: mfix(q.e),
          gen: 1,
        });
        made++;
      }
    });
    return t;
  });
}

export function buildChemCurriculum(): { topics: Topic[]; il: Record<string, InteractiveLesson> } {
  const allDefs: Record<string, any[]> = { ...CDEF, ...NEW_CHEM_2027_DEFS, ...NERDC_EXTRA_DEFS };
  const classRank: Record<string, number> = { ss1: 1, ss2: 2, ss3: 3 };
  const orderIdx = new Map(CHEM_SYLLABUS_ORDER.map((id, idx) => [id, idx]));

  const combinedRaw = [...CHEM.topics, ...NEW_CHEM_2027_TOPICS, ...NERDC_EXTRA_TOPICS].map(orig => {
    const meta = CHEM_SYLLABUS_2027_META[orig.id];
    const extraQs = CHEM_2027_EXTRA_QS[orig.id] || [];
    return {
      ...orig,
      name: meta?.name || orig.name,
      sec: meta?.sec || orig.sec,
      goals: meta?.goals && meta.goals.length ? meta.goals : orig.goals,
      trap: meta?.trap || orig.trap,
      qs: extraQs.length ? [...orig.qs, ...extraQs] : orig.qs,
    };
  });

  combinedRaw.sort((a, b) => {
    const na = CHEM_NERDC_MAP[a.id];
    const nb = CHEM_NERDC_MAP[b.id];
    if (na && nb) {
      const cDiff = (classRank[na.classId] || 9) - (classRank[nb.classId] || 9);
      if (cDiff !== 0) return cDiff;
      return na.order - nb.order;
    }
    return (orderIdx.get(a.id) ?? 999) - (orderIdx.get(b.id) ?? 999);
  });

  const prepped = chemPrep(combinedRaw);
  const topics = applyChemGenerators(prepped);
  const il: Record<string, InteractiveLesson> = {};
  topics.forEach(t => {
    if (!t.boss) t.boss = `${t.name} Mastery Test`;
    const parts = t.parts.map((x, pi) => {
      const X = (allDefs[t.id] || [])[pi] || {};
      const y = x.tryit;
      const fb = (y.fb ? y.fb.slice() : y.o.map(() => y.h));
      fb[y.a] = y.e;
      const why = x.ex.why;
      const prepended = ((CHEM_2027_PREPENDED_BEATS[t.id] || {})[pi] || []);
      const nerdcTeach = ((NERDC_EXTRA_TEACH[t.id] || {})[pi] || []);
      const T = [...prepended, ...nerdcTeach, ...((TEACH[t.id] || [])[pi] || [])];
      return {
        title: x.title,
        beats: [
          ...T,
          { k: "idea", kl: T.length ? "DEFINITIONS AND KEY FACTS" : "", idea: X.idea != null ? X.idea : x.idea, defs: X.d, laws: X.l, g: x.g, cap: x.cap, rules: X.r || x.rules, rh: "Key facts" },
          { k: "fade", lv: "full", q: x.ex.q, g: x.ex.g, steps: x.ex.steps.map(([m, w], j) => ({ m, why: w, ex: why && why[0] === j ? { q: why[1], o: why[2], fb: why[3], a: 0 } : undefined })) },
          { k: "check", q: y.q, g: y.g, given: y.given, ask: y.ask, o: y.o, a: y.a, fb, h: [y.h] },
        ],
      };
    });
    if (t.spot) parts[Math.min(t.spot.part, parts.length - 1)].beats.push(Object.assign({ k: "spot" }, t.spot));
    const last = parts[parts.length - 1];
    const q = t.qs.find(z => z.l === 2 && z.w);
    if (q) {
      last.beats.push({
        k: "check",
        title: "One more, on your own",
        q: q.q,
        g: q.g,
        o: q.o,
        a: q.a,
        fb: q.w.map((w, k) => k === q.a ? q.e : w),
        h: [last.beats[0].rules ? last.beats[0].rules[0] : ""],
      });
    }
    il[t.id] = { parts };
  });
  return { topics, il };
}
