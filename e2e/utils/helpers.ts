let opportunityStageIndex = 0;
let currentUserIndex = 0;

export function getNextOpportunityStage(stages: string[]): string {
  const stage = stages[opportunityStageIndex];
  opportunityStageIndex = (opportunityStageIndex + 1) % stages.length;
  return stage;
}

export function getRandomAcademicSearch(searches: string[]): string {
  const randomIndex = Math.floor(Math.random() * searches.length);
  return searches[randomIndex];
}

/**
 * Retrieves the next user from the users array in a circular manner.
 * @param users - Array of user objects.
 * @returns A user object containing firstName, lastName, and email.
 */
export function getNextUser(users: Array<{ firstName: string; lastName: string; email: string }>): { firstName: string; lastName: string; email: string } {
  const user = users[currentUserIndex];
  currentUserIndex = (currentUserIndex + 1) % users.length;
  return user;
}

    // genrate Random mobile Number
    // export function generateIndianMobileNumber(): string {
    //   const firstDigit = ['6', '7', '8', '9'][Math.floor(Math.random() * 4)]; // Choose 6,7,8,9
    //   const remainingDigits = Math.floor(100000000 + Math.random() * 900000000); // Generate 9 random digits
    //   return firstDigit + remainingDigits.toString();
    // }