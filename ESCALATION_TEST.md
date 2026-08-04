# Lead Pipeline Escalation System - Test Scenarios

## Implementation Summary
The escalation system assigns tiers to each pipeline stage, preventing leads from moving backward.

### Pipeline Tiers
| Tier | Stage | Allowed Transitions |
|------|-------|-------------------|
| 1 | New | → Contacted, Qualified, Schedule a Demo, Demo Done, Quote Sent, Closed Won, **Closed Lost** |
| 2 | Contacted | → Qualified, Schedule a Demo, Demo Done, Quote Sent, Closed Won, **Closed Lost** |
| 3 | Qualified | → Schedule a Demo, Demo Done, Quote Sent, Closed Won, **Closed Lost** |
| 4 | Schedule a Demo | → Demo Done, Quote Sent, Closed Won, **Closed Lost** |
| 5 | Demo Done | → Quote Sent, Closed Won, **Closed Lost** |
| 6 | Quote Sent | → Closed Won, **Closed Lost** |
| 7 | Closed Won | → **Closed Lost** (rare) |
| 8 | Closed Lost | → None (terminal state) |

## Test Cases

### ✅ Valid Transitions (Should Succeed)
1. **New → Contacted**: Lead contacted, moving forward
2. **Contacted → Qualified**: Need confirmed, ready to demo
3. **Qualified → Schedule a Demo**: Booking demo
4. **Demo Done → Quote Sent**: After demo, sending quote
5. **Any Stage → Closed Lost**: Can mark as lost at any point
6. **Same Stage → Same Stage**: Refresh/update same status

### ❌ Invalid Transitions (Should Be Blocked)
1. **Contacted → New**: ❌ Can't go backward
2. **Qualified → Contacted**: ❌ Can't demote after qualification
3. **Demo Done → Schedule a Demo**: ❌ Can't revert scheduling
4. **Quote Sent → Demo Done**: ❌ Can't reverse quote
5. **Closed Won → Quote Sent**: ❌ Can't reopen closed deal

## Implementation Details

### New Functions in `pipeline.ts`
```typescript
// Get tier of a stage
stageTier(status: string): number

// Check if transition is valid
isValidTransition(fromStatus: string, toStatus: string): boolean

// Get valid next stages
getValidNextStages(currentStatus: string): PipelineStage[]
```

### LeadsManager Changes
- ✅ Status dropdown shows only valid next stages
- ✅ Error message displays if invalid transition attempted
- ✅ Bulk operations validate per-lead
- ✅ "Closed Lost" accessible from anywhere
- ✅ Auto-clears error after 5 seconds

## UI Behavior

### Individual Lead Status Update
1. User clicks status dropdown on a lead
2. Only valid next stages are shown
3. If user somehow attempts invalid transition → Error alert appears
4. Error includes lead name, current stage, and attempted stage

### Bulk Status Update
1. Select multiple leads
2. Choose target status from dropdown
3. Click "Move to [Status]"
4. Any leads that can't transition are skipped
5. Error shows count of skipped leads

### Error Message Example
```
"Cannot move "Acme Corp Ltd" from "Quote Sent" back to "Schedule a Demo". 
Leads can only escalate forward or to Closed Lost."
```

## Data Validation Layer
The `isValidTransition()` function enforces:
- Higher tier = more advanced stage (no backward movement)
- Same tier = allowed (status refresh)
- "Closed Lost" = accessible from any tier (special case)
- Returns `false` for any backward movement (except to Closed Lost)

## Benefits
1. **Data Integrity**: Prevents pipeline stage reversions
2. **Clear Progression**: Forces logical lead progression
3. **Flexibility**: Can skip stages (New → Qualified directly)
4. **Safety Net**: Closed Lost always available for rejected leads
5. **User Feedback**: Clear error messages on invalid attempts
