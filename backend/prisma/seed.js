import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
  // PHYSIOLOGICAL INTEGRITY - EASY (10 questions)
  {
    content: "A nurse is caring for a client with hypertension. Which dietary recommendation is most appropriate?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["b"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Increase sodium intake" },
      { id: "b", text: "Reduce sodium intake" },
      { id: "c", text: "Increase saturated fat intake" },
      { id: "d", text: "Eliminate all carbohydrates" }
    ]),
    explanation: "Clients with hypertension should reduce sodium intake to help manage blood pressure. High sodium intake increases blood pressure by causing fluid retention."
  },
  {
    content: "What is the normal range for adult heart rate?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["c"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "40-60 beats per minute" },
      { id: "b", text: "50-70 beats per minute" },
      { id: "c", text: "60-100 beats per minute" },
      { id: "d", text: "100-120 beats per minute" }
    ]),
    explanation: "The normal adult heart rate is 60-100 beats per minute. Bradycardia is below 60, and tachycardia is above 100 beats per minute."
  },
  {
    content: "A client is experiencing dyspnea. What position should the nurse place the client in?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["b"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Supine" },
      { id: "b", text: "Fowler's or Semi-Fowler's" },
      { id: "c", text: "Trendelenburg" },
      { id: "d", text: "Prone" }
    ]),
    explanation: "Fowler's or Semi-Fowler's position (head elevated 30-90 degrees) promotes lung expansion and eases breathing for clients with dyspnea."
  },
  {
    content: "What is the first action a nurse should take when discovering a fire?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["a"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Rescue and remove clients from danger" },
      { id: "b", text: "Sound the alarm" },
      { id: "c", text: "Contain the fire by closing doors" },
      { id: "d", text: "Extinguish the fire" }
    ]),
    explanation: "RACE protocol: Rescue clients first, Alarm (activate fire alarm), Contain (close doors), Extinguish or Evacuate. Client safety is always the priority."
  },
  {
    content: "A nurse is preparing to administer an intramuscular injection. What is the maximum volume that can be safely injected into the deltoid muscle?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["b"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "0.5 mL" },
      { id: "b", text: "1 mL" },
      { id: "c", text: "3 mL" },
      { id: "d", text: "5 mL" }
    ]),
    explanation: "The deltoid muscle can safely accommodate up to 1 mL of medication. Larger volumes (up to 3 mL) can be given in the vastus lateralis or ventrogluteal sites."
  },
  {
    content: "What is the normal range for adult respiratory rate?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["c"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "8-12 breaths per minute" },
      { id: "b", text: "10-16 breaths per minute" },
      { id: "c", text: "12-20 breaths per minute" },
      { id: "d", text: "20-30 breaths per minute" }
    ]),
    explanation: "The normal adult respiratory rate is 12-20 breaths per minute. Bradypnea is below 12, and tachypnea is above 20 breaths per minute."
  },
  {
    content: "A nurse is caring for a client with diabetes. Which symptom indicates hypoglycemia?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["a"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Tremors and diaphoresis" },
      { id: "b", text: "Increased urination" },
      { id: "c", text: "Dry skin and mucous membranes" },
      { id: "d", text: "Fruity breath odor" }
    ]),
    explanation: "Hypoglycemia presents with tremors, diaphoresis, tachycardia, confusion, and hunger. Hyperglycemia presents with polyuria, polydipsia, dry skin, and fruity breath."
  },
  {
    content: "What is the proper hand hygiene duration when using soap and water?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["c"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "5 seconds" },
      { id: "b", text: "10 seconds" },
      { id: "c", text: "15-20 seconds" },
      { id: "d", text: "30-60 seconds" }
    ]),
    explanation: "Proper hand washing with soap and water should last at least 15-20 seconds to effectively remove microorganisms and prevent infection transmission."
  },
  {
    content: "A client is prescribed warfarin. Which food should the nurse advise to consume in consistent amounts?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["b"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Red meat" },
      { id: "b", text: "Green leafy vegetables" },
      { id: "c", text: "Citrus fruits" },
      { id: "d", text: "Dairy products" }
    ]),
    explanation: "Green leafy vegetables contain vitamin K, which antagonizes warfarin. Patients should maintain consistent intake rather than avoiding these foods entirely."
  },
  {
    content: "What is the normal range for adult blood pressure?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["b"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "100/60 mmHg" },
      { id: "b", text: "120/80 mmHg" },
      { id: "c", text: "140/90 mmHg" },
      { id: "d", text: "160/100 mmHg" }
    ]),
    explanation: "Normal adult blood pressure is around 120/80 mmHg. Hypertension is diagnosed when BP is consistently ≥130/80 mmHg or ≥140/90 mmHg depending on guidelines."
  },

  // PHYSIOLOGICAL INTEGRITY - MEDIUM (10 questions)
  {
    content: "Which assessment findings indicate respiratory distress in a client? Select all that apply.",
    type: "MULTIPLE",
    category: "Physiological Integrity",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["a", "c", "d"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Use of accessory muscles" },
      { id: "b", text: "Respiratory rate of 16 breaths per minute" },
      { id: "c", text: "Nasal flaring" },
      { id: "d", text: "Cyanosis" },
      { id: "e", text: "Eupnea" }
    ]),
    explanation: "Signs of respiratory distress include use of accessory muscles, nasal flaring, and cyanosis. A respiratory rate of 16 is normal, and eupnea means normal breathing."
  },
  {
    content: "A nurse is caring for a client receiving IV heparin. Which laboratory value should be monitored?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["b"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "INR (International Normalized Ratio)" },
      { id: "b", text: "aPTT (activated Partial Thromboplastin Time)" },
      { id: "c", text: "Platelet count only" },
      { id: "d", text: "Hemoglobin A1C" }
    ]),
    explanation: "aPTT is monitored for clients receiving IV heparin. INR is monitored for warfarin therapy. The therapeutic range for aPTT is 1.5-2.5 times the control value."
  },
  {
    content: "A client with chronic kidney disease has a potassium level of 6.2 mEq/L. Which ECG changes might the nurse expect?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["c"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Prolonged QT interval" },
      { id: "b", text: "ST segment elevation" },
      { id: "c", text: "Tall, peaked T waves" },
      { id: "d", text: "U waves" }
    ]),
    explanation: "Hyperkalemia (K+ >5.5 mEq/L) causes tall, peaked T waves, widened QRS complex, and can progress to life-threatening arrhythmias if untreated."
  },
  {
    content: "Which interventions are appropriate for a client with increased intracranial pressure? Select all that apply.",
    type: "MULTIPLE",
    category: "Physiological Integrity",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["a", "c", "e"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Elevate head of bed 30 degrees" },
      { id: "b", text: "Encourage coughing and deep breathing" },
      { id: "c", text: "Maintain head and neck in neutral alignment" },
      { id: "d", text: "Cluster nursing activities" },
      { id: "e", text: "Minimize environmental stimulation" }
    ]),
    explanation: "For increased ICP: elevate HOB 30°, maintain neutral head/neck alignment, minimize stimulation. Avoid coughing, straining, and clustering activities as these increase ICP."
  },
  {
    content: "A client is prescribed digoxin 0.25 mg PO daily. The nurse notes the apical pulse is 58 beats/min. What is the priority action?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["c"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Administer the medication as prescribed" },
      { id: "b", text: "Recheck the pulse in 15 minutes" },
      { id: "c", text: "Withhold the medication and notify the provider" },
      { id: "d", text: "Administer half the prescribed dose" }
    ]),
    explanation: "Withhold digoxin if apical pulse is <60 beats/min as it can cause further bradycardia. Notify the provider before administering. Never adjust the dose independently."
  },
  {
    content: "A postoperative client is at risk for deep vein thrombosis. Which assessment findings suggest DVT? Select all that apply.",
    type: "MULTIPLE",
    category: "Physiological Integrity",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["b", "c", "d"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Decreased peripheral pulse" },
      { id: "b", text: "Unilateral leg swelling" },
      { id: "c", text: "Warmth and redness in the calf" },
      { id: "d", text: "Positive Homans' sign" },
      { id: "e", text: "Bilateral leg pain" }
    ]),
    explanation: "DVT presents with unilateral leg swelling, warmth, redness, and positive Homans' sign (pain with dorsiflexion). Peripheral pulses are usually present."
  },
  {
    content: "A client with pneumonia has decreased breath sounds in the right lower lobe. What position will best promote drainage?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["b"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Right side-lying" },
      { id: "b", text: "Left side-lying" },
      { id: "c", text: "Supine" },
      { id: "d", text: "Prone" }
    ]),
    explanation: "Position the unaffected lung down (left side-lying) to promote drainage from the affected right lower lobe. This improves ventilation-perfusion matching."
  },
  {
    content: "A nurse is caring for a client with acute pancreatitis. Which laboratory values would the nurse expect to be elevated? Select all that apply.",
    type: "MULTIPLE",
    category: "Physiological Integrity",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["a", "b", "d"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Serum amylase" },
      { id: "b", text: "Serum lipase" },
      { id: "c", text: "Serum albumin" },
      { id: "d", text: "White blood cell count" },
      { id: "e", text: "Hemoglobin" }
    ]),
    explanation: "Acute pancreatitis causes elevated amylase and lipase (pancreatic enzymes), and elevated WBC due to inflammation. Albumin may decrease, not increase."
  },
  {
    content: "A client is receiving total parenteral nutrition (TPN). The nurse notes the infusion is running 2 hours behind schedule. What is the appropriate action?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["a"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Continue infusion at prescribed rate" },
      { id: "b", text: "Increase rate to catch up" },
      { id: "c", text: "Stop infusion and start a new bag" },
      { id: "d", text: "Increase rate by 50% for 2 hours" }
    ]),
    explanation: "Never increase TPN infusion rate to catch up, as this can cause hyperglycemia and metabolic complications. Continue at prescribed rate and document."
  },
  {
    content: "Which findings indicate fluid volume deficit in an adult client? Select all that apply.",
    type: "MULTIPLE",
    category: "Physiological Integrity",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["a", "c", "d", "e"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Decreased skin turgor" },
      { id: "b", text: "Crackles in lung bases" },
      { id: "c", text: "Increased heart rate" },
      { id: "d", text: "Decreased urine output" },
      { id: "e", text: "Hypotension" }
    ]),
    explanation: "Fluid volume deficit presents with decreased skin turgor, tachycardia, decreased urine output, and hypotension. Crackles indicate fluid volume excess."
  },

  // SAFE AND EFFECTIVE CARE ENVIRONMENT - EASY (5 questions)
  {
    content: "A nurse is delegating tasks to unlicensed assistive personnel (UAP). Which task is appropriate to delegate?",
    type: "SINGLE",
    category: "Safe and Effective Care Environment",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["b"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Assessing a client's pain level" },
      { id: "b", text: "Taking vital signs on a stable client" },
      { id: "c", text: "Administering oral medications" },
      { id: "d", text: "Developing a care plan" }
    ]),
    explanation: "UAP can perform routine tasks like taking vital signs on stable clients. Assessment, medication administration, and care planning require RN licensure."
  },
  {
    content: "What is the most important step before administering any medication?",
    type: "SINGLE",
    category: "Safe and Effective Care Environment",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["c"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Check the expiration date" },
      { id: "b", text: "Document administration" },
      { id: "c", text: "Verify the client's identity using two identifiers" },
      { id: "d", text: "Assess vital signs" }
    ]),
    explanation: "Verifying client identity using two identifiers (name and date of birth) is the most critical step to prevent medication errors. This follows the Rights of Medication Administration."
  },
  {
    content: "A nurse witnesses a colleague taking a medication from the medication cart. What is the appropriate action?",
    type: "SINGLE",
    category: "Safe and Effective Care Environment",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["d"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Ignore it as it's not your concern" },
      { id: "b", text: "Confront the colleague immediately" },
      { id: "c", text: "Tell other staff members about the incident" },
      { id: "d", text: "Report the incident to the supervisor" }
    ]),
    explanation: "Drug diversion is a serious offense. Report to supervisor immediately following facility policy. Do not confront the colleague or gossip with others."
  },
  {
    content: "Which action requires the use of sterile technique?",
    type: "SINGLE",
    category: "Safe and Effective Care Environment",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["b"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Giving a bed bath" },
      { id: "b", text: "Inserting a urinary catheter" },
      { id: "c", text: "Taking an oral temperature" },
      { id: "d", text: "Administering oral medications" }
    ]),
    explanation: "Inserting a urinary catheter requires sterile technique because it enters a sterile body cavity. The other procedures require clean technique."
  },
  {
    content: "A nurse is preparing to transfer a client from bed to wheelchair. What is the first priority?",
    type: "SINGLE",
    category: "Safe and Effective Care Environment",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["c"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Raise the bed to the highest position" },
      { id: "b", text: "Remove the wheelchair armrests" },
      { id: "c", text: "Lock the wheelchair brakes" },
      { id: "d", text: "Have the client stand immediately" }
    ]),
    explanation: "Locking wheelchair brakes is essential to prevent the chair from rolling and causing client falls during transfer. Safety is always the priority."
  },

  // SAFE AND EFFECTIVE CARE ENVIRONMENT - MEDIUM (5 questions)
  {
    content: "Which clients should be assigned to the experienced RN rather than a new graduate nurse? Select all that apply.",
    type: "MULTIPLE",
    category: "Safe and Effective Care Environment",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["a", "c", "d"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Client requiring complex wound care" },
      { id: "b", text: "Client receiving routine IV antibiotics" },
      { id: "c", text: "Client in acute respiratory distress" },
      { id: "d", text: "Client with new-onset chest pain" },
      { id: "e", text: "Client preparing for discharge home" }
    ]),
    explanation: "Unstable clients, those requiring complex care, or new assessments should be assigned to experienced nurses. Stable clients with routine care can be assigned to new graduates."
  },
  {
    content: "A nurse discovers a medication error. What is the priority action?",
    type: "SINGLE",
    category: "Safe and Effective Care Environment",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["b"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Complete an incident report" },
      { id: "b", text: "Assess the client for adverse effects" },
      { id: "c", text: "Notify the pharmacy" },
      { id: "d", text: "Document the error in the medical record" }
    ]),
    explanation: "Client safety is the priority. First assess the client for adverse effects, then notify the provider, complete incident report, and document. Never hide medication errors."
  },
  {
    content: "Which situations require a nurse to file an incident report? Select all that apply.",
    type: "MULTIPLE",
    category: "Safe and Effective Care Environment",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["a", "b", "d", "e"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Client falls while walking to bathroom" },
      { id: "b", text: "Medication administered 2 hours late" },
      { id: "c", text: "Client refuses prescribed medication" },
      { id: "d", text: "Visitor slips on wet floor" },
      { id: "e", text: "Missing narcotic from medication cart" }
    ]),
    explanation: "Incident reports document falls, medication errors, visitor injuries, and missing controlled substances. Client refusal is their right and doesn't require incident report."
  },
  {
    content: "A nurse is caring for multiple clients. Which client should be assessed first?",
    type: "SINGLE",
    category: "Safe and Effective Care Environment",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["a"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Client with chest pain radiating to the left arm" },
      { id: "b", text: "Client requesting pain medication for chronic back pain" },
      { id: "c", text: "Client scheduled for discharge in 2 hours" },
      { id: "d", text: "Client needing assistance with morning hygiene" }
    ]),
    explanation: "Chest pain radiating to left arm suggests possible myocardial infarction - a life-threatening emergency requiring immediate assessment and intervention."
  },
  {
    content: "Which actions help prevent healthcare-associated infections? Select all that apply.",
    type: "MULTIPLE",
    category: "Safe and Effective Care Environment",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["a", "b", "c", "e"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Performing hand hygiene before and after client contact" },
      { id: "b", text: "Using sterile technique for invasive procedures" },
      { id: "c", text: "Changing IV tubing per facility protocol" },
      { id: "d", text: "Keeping bed in high position" },
      { id: "e", text: "Discontinuing catheters and lines as soon as possible" }
    ]),
    explanation: "Infection prevention includes hand hygiene, sterile technique, following protocols for equipment changes, and removing devices promptly. Bed height relates to fall prevention."
  },

  // HEALTH PROMOTION AND MAINTENANCE - EASY (3 questions)
  {
    content: "A nurse is teaching a client about increasing dietary fiber. Which food should be recommended?",
    type: "SINGLE",
    category: "Health Promotion and Maintenance",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["c"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "White bread" },
      { id: "b", text: "Cheese" },
      { id: "c", text: "Whole grain cereal" },
      { id: "d", text: "Ice cream" }
    ]),
    explanation: "Whole grain cereals are high in dietary fiber. White bread, cheese, and ice cream are low in fiber. Fiber helps with digestion and prevents constipation."
  },
  {
    content: "At what age should children begin receiving annual flu vaccinations?",
    type: "SINGLE",
    category: "Health Promotion and Maintenance",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["a"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "6 months" },
      { id: "b", text: "1 year" },
      { id: "c", text: "2 years" },
      { id: "d", text: "5 years" }
    ]),
    explanation: "Annual influenza vaccination is recommended for all individuals 6 months of age and older, unless contraindicated."
  },
  {
    content: "A nurse is teaching a pregnant client about nutrition. Which statement indicates understanding?",
    type: "SINGLE",
    category: "Health Promotion and Maintenance",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["b"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "I should eat for two people now" },
      { id: "b", text: "I need to take prenatal vitamins with folic acid" },
      { id: "c", text: "I can eat deli meats and soft cheeses" },
      { id: "d", text: "I don't need to change my diet during pregnancy" }
    ]),
    explanation: "Prenatal vitamins with folic acid (400-800 mcg daily) prevent neural tube defects. Pregnant women should avoid deli meats and soft cheeses due to Listeria risk."
  },

  // HEALTH PROMOTION AND MAINTENANCE - MEDIUM (2 questions)
  {
    content: "Which health screenings are recommended for women over 40? Select all that apply.",
    type: "MULTIPLE",
    category: "Health Promotion and Maintenance",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["a", "b", "c", "d"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Annual mammogram" },
      { id: "b", text: "Colonoscopy every 10 years starting at age 45-50" },
      { id: "c", text: "Annual blood pressure screening" },
      { id: "d", text: "Lipid panel screening" },
      { id: "e", text: "Monthly chest X-rays" }
    ]),
    explanation: "Women over 40 should have annual mammograms, colonoscopy starting at 45-50, annual BP screening, and lipid panel per guidelines. Monthly chest X-rays are not recommended."
  },
  {
    content: "A nurse is teaching new parents about infant sleep safety. Which statements should be included? Select all that apply.",
    type: "MULTIPLE",
    category: "Health Promotion and Maintenance",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["a", "c", "d", "e"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Place infant on back to sleep" },
      { id: "b", text: "Use soft bedding and pillows" },
      { id: "c", text: "Keep crib free of toys and bumpers" },
      { id: "d", text: "Room-share but not bed-share" },
      { id: "e", text: "Use a firm mattress" }
    ]),
    explanation: "Safe sleep guidelines: back to sleep, firm mattress, no soft bedding/toys/bumpers, room-share not bed-share. This prevents SIDS (Sudden Infant Death Syndrome)."
  },

  // PSYCHOSOCIAL INTEGRITY - EASY (2 questions)
  {
    content: "A client appears anxious before surgery. What is the most therapeutic response by the nurse?",
    type: "SINGLE",
    category: "Psychosocial Integrity",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["b"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Everything will be fine, don't worry" },
      { id: "b", text: "You seem anxious. Would you like to talk about your concerns?" },
      { id: "c", text: "Many people have this surgery and do well" },
      { id: "d", text: "You should try to relax and think positive thoughts" }
    ]),
    explanation: "Therapeutic communication acknowledges feelings and offers opportunity to discuss concerns. Avoid false reassurance, cliches, and dismissing emotions."
  },
  {
    content: "A nurse is caring for a client with depression. Which nursing intervention is appropriate?",
    type: "SINGLE",
    category: "Psychosocial Integrity",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["c"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Leave the client alone to rest" },
      { id: "b", text: "Tell the client to cheer up" },
      { id: "c", text: "Spend time with the client even if they don't talk" },
      { id: "d", text: "Encourage the client to make major life decisions" }
    ]),
    explanation: "Therapeutic presence - spending time with depressed clients - shows care and prevents isolation. Avoid false cheerfulness and discourage major decisions during acute depression."
  },

  // PSYCHOSOCIAL INTEGRITY - MEDIUM (3 questions)
  {
    content: "Which behaviors suggest a client may be experiencing domestic violence? Select all that apply.",
    type: "MULTIPLE",
    category: "Psychosocial Integrity",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["a", "c", "d", "e"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Frequent visits to emergency department" },
      { id: "b", text: "Maintaining strong social connections" },
      { id: "c", text: "Partner answers questions for the client" },
      { id: "d", text: "Injuries inconsistent with explanation" },
      { id: "e", text: "Anxiety when partner is present" }
    ]),
    explanation: "Red flags for domestic violence: frequent ED visits, controlling partner, inconsistent injury explanations, anxiety around partner. Strong social connections suggest healthy support system."
  },
  {
    content: "A client with schizophrenia reports hearing voices. What is the most therapeutic response?",
    type: "SINGLE",
    category: "Psychosocial Integrity",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["c"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "The voices are not real, they're just in your imagination" },
      { id: "b", text: "What are the voices telling you to do?" },
      { id: "c", text: "I understand the voices are real to you. I don't hear them. Let's focus on something else" },
      { id: "d", text: "Try to ignore the voices and they will go away" }
    ]),
    explanation: "Accept that hallucinations are real to the client while presenting reality. Ask about command hallucinations only if assessing for safety. Avoid arguing or dismissing experiences."
  },
  {
    content: "Which interventions are appropriate for a client at risk for suicide? Select all that apply.",
    type: "MULTIPLE",
    category: "Psychosocial Integrity",
    difficulty: "HARD",
    correctAnswers: JSON.stringify(["a", "b", "d", "e"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Remove potentially harmful objects" },
      { id: "b", text: "Place on one-to-one observation" },
      { id: "c", text: "Assign to a private room at end of hall" },
      { id: "d", text: "Ask directly about suicidal thoughts and plans" },
      { id: "e", text: "Involve mental health team immediately" }
    ]),
    explanation: "Suicide precautions: remove harmful objects, close observation, ask direct questions about intent/plan, involve mental health team. Place near nurses' station, not isolated at end of hall."
  },

  // PHYSIOLOGICAL INTEGRITY - HARD (5 questions)
  {
    content: "A client in diabetic ketoacidosis has the following ABG results: pH 7.28, PaCO2 32, HCO3 16. How should the nurse interpret these findings?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "HARD",
    correctAnswers: JSON.stringify(["b"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Respiratory acidosis" },
      { id: "b", text: "Metabolic acidosis" },
      { id: "c", text: "Respiratory alkalosis" },
      { id: "d", text: "Metabolic alkalosis" }
    ]),
    explanation: "pH <7.35 indicates acidosis. HCO3 <22 indicates metabolic origin. PaCO2 <35 shows respiratory compensation (hyperventilation). This is metabolic acidosis with partial compensation."
  },
  {
    content: "A client is receiving norepinephrine infusion. Which assessments are essential? Select all that apply.",
    type: "MULTIPLE",
    category: "Physiological Integrity",
    difficulty: "HARD",
    correctAnswers: JSON.stringify(["a", "b", "c", "e"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Blood pressure every 5-15 minutes" },
      { id: "b", text: "Peripheral circulation and skin color" },
      { id: "c", text: "IV site for infiltration" },
      { id: "d", text: "Respiratory rate every 4 hours" },
      { id: "e", text: "Cardiac rhythm continuously" }
    ]),
    explanation: "Norepinephrine is a potent vasopressor requiring: frequent BP monitoring, peripheral perfusion assessment, strict IV site monitoring (extravasation causes necrosis), and continuous cardiac monitoring."
  },
  {
    content: "A client develops acute chest pain. Troponin I is 0.8 ng/mL (normal <0.04). What does this indicate?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "HARD",
    correctAnswers: JSON.stringify(["c"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "No cardiac damage" },
      { id: "b", text: "Stable angina" },
      { id: "c", text: "Myocardial infarction" },
      { id: "d", text: "Pericarditis" }
    ]),
    explanation: "Elevated troponin I (>0.04 ng/mL) indicates myocardial damage, confirming MI. Troponin is highly specific for cardiac injury and rises 2-4 hours post-MI, peaking at 24-48 hours."
  },
  {
    content: "Which interventions are appropriate for a client with syndrome of inappropriate antidiuretic hormone (SIADH)? Select all that apply.",
    type: "MULTIPLE",
    category: "Physiological Integrity",
    difficulty: "HARD",
    correctAnswers: JSON.stringify(["b", "c", "d"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Encourage fluid intake of 3 liters per day" },
      { id: "b", text: "Restrict fluid intake to 800-1000 mL per day" },
      { id: "c", text: "Monitor serum sodium levels closely" },
      { id: "d", text: "Weigh daily at same time" },
      { id: "e", text: "Administer hypotonic IV fluids" }
    ]),
    explanation: "SIADH causes water retention and hyponatremia. Treatment: fluid restriction, monitor sodium, daily weights. Avoid hypotonic fluids which worsen hyponatremia. May give hypertonic saline for severe hyponatremia."
  },
  {
    content: "A client with cirrhosis develops hepatic encephalopathy. Which interventions should the nurse implement? Select all that apply.",
    type: "MULTIPLE",
    category: "Physiological Integrity",
    difficulty: "HARD",
    correctAnswers: JSON.stringify(["a", "c", "d", "e"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Administer lactulose as prescribed" },
      { id: "b", text: "Encourage high-protein diet" },
      { id: "c", text: "Monitor ammonia levels" },
      { id: "d", text: "Assess neurological status frequently" },
      { id: "e", text: "Implement fall precautions" }
    ]),
    explanation: "Hepatic encephalopathy is caused by elevated ammonia. Treatment: lactulose (reduces ammonia), moderate protein restriction (not high protein), monitor ammonia and neurological status, safety precautions for altered mental status."
  },
  // ADDITIONAL QUESTIONS TO REACH 50 TOTAL
  {
    content: "A nurse is caring for a client who is 2 hours postpartum. Which findings should be reported immediately? Select all that apply.",
    type: "MULTIPLE",
    category: "Health Promotion and Maintenance",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["a", "c", "e"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Saturating one perineal pad per hour" },
      { id: "b", text: "Fundus firm at umbilicus" },
      { id: "c", text: "Blood pressure 160/100 mmHg" },
      { id: "d", text: "Lochia rubra with small clots" },
      { id: "e", text: "Pulse rate 120 beats per minute" }
    ]),
    explanation: "Saturating one pad per hour indicates excessive bleeding (normal is <1 pad/hour). BP 160/100 suggests postpartum preeclampsia. Pulse 120 may indicate hemorrhage or infection. Firm fundus at umbilicus and lochia rubra are normal postpartum findings."
  },
  {
    content: "A client is prescribed warfarin. Which laboratory value should the nurse monitor?",
    type: "SINGLE",
    category: "Physiological Integrity",
    difficulty: "EASY",
    correctAnswers: JSON.stringify(["b"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Activated partial thromboplastin time (aPTT)" },
      { id: "b", text: "International normalized ratio (INR)" },
      { id: "c", text: "Platelet count" },
      { id: "d", text: "Bleeding time" }
    ]),
    explanation: "Warfarin (Coumadin) is monitored via INR. Therapeutic range is typically 2-3 for most conditions. aPTT monitors heparin therapy. The INR measures the extrinsic clotting pathway."
  },
  {
    content: "Which actions should a nurse take when administering a blood transfusion? Select all that apply.",
    type: "MULTIPLE",
    category: "Safe and Effective Care Environment",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["a", "b", "d", "e"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Verify client identity with two identifiers" },
      { id: "b", text: "Use 0.9% normal saline for the IV line" },
      { id: "c", text: "Infuse the blood over 6-8 hours" },
      { id: "d", text: "Stay with client for first 15 minutes" },
      { id: "e", text: "Take baseline vital signs before starting" }
    ]),
    explanation: "Blood transfusion safety: verify identity with two identifiers, use normal saline (only compatible solution), stay with client first 15 minutes (most reactions occur early), monitor vital signs. Each unit should infuse within 4 hours maximum, not 6-8 hours."
  },
  {
    content: "A client with bipolar disorder is experiencing a manic episode. Which intervention has priority?",
    type: "SINGLE",
    category: "Psychosocial Integrity",
    difficulty: "MEDIUM",
    correctAnswers: JSON.stringify(["c"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Encourage group therapy participation" },
      { id: "b", text: "Provide detailed explanations of unit rules" },
      { id: "c", text: "Ensure adequate nutrition and hydration" },
      { id: "d", text: "Promote sleep by darkening the room" }
    ]),
    explanation: "During manic episodes, clients often neglect basic needs. Priority is maintaining physical health through adequate nutrition, hydration, and rest. Avoid overstimulation (group therapy), keep communication brief, and provide frequent small meals."
  },
  {
    content: "A client is receiving mechanical ventilation. Which nursing interventions are appropriate? Select all that apply.",
    type: "MULTIPLE",
    category: "Physiological Integrity",
    difficulty: "HARD",
    correctAnswers: JSON.stringify(["a", "b", "c", "d"]),
    allAnswers: JSON.stringify([
      { id: "a", text: "Elevate head of bed 30-45 degrees" },
      { id: "b", text: "Perform oral care every 2-4 hours" },
      { id: "c", text: "Monitor ventilator alarms continuously" },
      { id: "d", text: "Suction only when clinically indicated" },
      { id: "e", text: "Keep endotracheal tube cuff pressure at 30-35 mmHg" }
    ]),
    explanation: "Ventilator care: elevate HOB to prevent aspiration, oral care reduces VAP risk, monitor alarms, suction PRN (not routinely). ET cuff pressure should be 20-25 mmHg (not 30-35) to prevent tracheal damage while maintaining seal."
  }
];

async function seed() {
  console.log('Starting seed...');

  try {
    // Clear existing data
    await prisma.userAnswer.deleteMany();
    console.log('Deleted existing UserAnswers');

    await prisma.question.deleteMany();
    console.log('Deleted existing Questions');

    await prisma.user.deleteMany();
    console.log('Deleted existing Users');

    // Seed questions
    for (const question of questions) {
      await prisma.question.create({ data: question });
    }

    console.log(`✓ Created ${questions.length} questions`);
    console.log('✓ Seed completed successfully!');
    console.log('\nQuestion distribution:');
    console.log(`- SINGLE choice: ${questions.filter(q => q.type === 'SINGLE').length}`);
    console.log(`- MULTIPLE choice: ${questions.filter(q => q.type === 'MULTIPLE').length}`);
    console.log('\nDifficulty distribution:');
    console.log(`- EASY: ${questions.filter(q => q.difficulty === 'EASY').length}`);
    console.log(`- MEDIUM: ${questions.filter(q => q.difficulty === 'MEDIUM').length}`);
    console.log(`- HARD: ${questions.filter(q => q.difficulty === 'HARD').length}`);
    console.log('\nCategory distribution:');
    const categories = [...new Set(questions.map(q => q.category))];
    categories.forEach(cat => {
      console.log(`- ${cat}: ${questions.filter(q => q.category === cat).length}`);
    });
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
}

seed()
  .catch((e) => {
    console.error('Fatal seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
