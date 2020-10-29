import { Status } from "brackets-model";
import { isMajorRound } from "./helpers";
import { FinalType, MatchHint } from "./types";

// TODO: rename match hint to position hint

/**
 * Returns a match hint based on rounds information.
 *
 * @param roundNumber Number of the round.
 * @param roundCount Count of rounds.
 * @param inLowerBracket Whether the round is in lower bracket.
 */
export function getMatchHint(roundNumber: number, roundCount: number, inLowerBracket?: boolean): MatchHint {
    if (!inLowerBracket && roundNumber === 1)
        return (i: number) => `Seed ${i}`;

    if (inLowerBracket && isMajorRound(roundNumber)) {
        const roundNumberWB = Math.ceil((roundNumber + 1) / 2);

        let hint = (i: number) => `Loser of WB ${roundNumberWB}.${i}`;

        if (roundNumber === roundCount - 2)
            hint = (i: number) => `Loser of WB Semi ${i}`;

        if (roundNumber === roundCount)
            hint = () => 'Loser of WB Final';

        return hint;
    }

    return undefined;
}

/**
 * Returns the label of a match.
 *
 * @param matchNumber Number of the match.
 * @param roundNumber Number of the round.
 * @param roundCount Count of rounds.
 * @param inLowerBracket Whether the round is in lower bracket.
 */
export function getMatchLabel(matchNumber: number, roundNumber: number, roundCount: number, inLowerBracket?: boolean): string {
    let matchPrefix = 'M';

    if (inLowerBracket)
        matchPrefix = 'LB';
    else if (inLowerBracket === false)
        matchPrefix = 'WB';

    const semiFinalRound = roundNumber === roundCount - 1;
    const finalRound = roundNumber === roundCount;

    let matchLabel = `${matchPrefix} ${roundNumber}.${matchNumber}`;

    if (!inLowerBracket && semiFinalRound)
        matchLabel = `Semi ${matchNumber}`;

    if (finalRound)
        matchLabel = 'Final';

    return matchLabel;
}

// TODO: refactor this, grandFinalName isn't always used... no need to pass it in the first place...

/**
 * Returns the label of a match in final.
 *
 * @param finalType Type of the final.
 * @param grandFinalName Name of the final.
 * @param roundNumber Number of the round.
 */
export function getFinalMatchLabel(finalType: FinalType, grandFinalName: (roundNumber: number) => string, roundNumber: number): string {
    return finalType === 'consolation_final' ? 'Consolation Final' : grandFinalName(roundNumber);
}

/**
 * Returns the hint of a match in final.
 *
 * @param finalType Type of the final.
 * @param roundNumber Number of the round.
 */
export function getFinalMatchHint(finalType: FinalType, roundNumber: number): MatchHint {
    // Single elimination.
    if (finalType === 'consolation_final')
        return number => `Loser of Semi ${number}`;

    // Double elimination.
    if (roundNumber === 1)
        return () => 'Winner of LB Final';

    return undefined;
}

/**
 * Returns the status of a match.
 *
 * @param status The match status.
 */
export function getMatchStatus(status: Status): string {
    switch (status) {
        case Status.Locked: return 'Locked';
        case Status.Waiting: return 'Waiting';
        case Status.Ready: return 'Ready';
        case Status.Running: return 'Running';
        case Status.Completed: return 'Completed';
        case Status.Archived: return 'Archived';
    }
}

/**
 * Returns the name of a grand final phase.
 *
 * @param roundCount Count of final rounds.
 */
export function getGrandFinalName(roundCount: number): (roundNumber: number) => string {
    return roundCount === 1 ? () => 'Grand Final' : (roundNumber: number) => `GF Round ${roundNumber}`;
}

/**
 * Returns the name of a group.
 *
 * @param groupNumber Number of the group.
 */
export function getGroupName(groupNumber: number): string {
    return `Group ${groupNumber}`;
}

/**
 * Returns the name of a round.
 *
 * @param roundNumber Number of the round.
 */
export function getRoundName(roundNumber: number): string {
    return `Round ${roundNumber}`;
}

/**
 * Returns the name of a round in the winner bracket of a double elimination stage.
 *
 * @param roundNumber Number of the round.
 */
export function getWinnerBracketRoundName(roundNumber: number): string {
    return `WB Round ${roundNumber}`;
}

/**
 * Returns the name of a round in the loser bracket of a double elimination stage.
 *
 * @param roundNumber Number of the round.
 */
export function getLoserBracketRoundName(roundNumber: number): string {
    return `LB Round ${roundNumber}`;
}

// TODO: add letters as traduction (W, L, D, F and all ranking headers)