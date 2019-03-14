const doNotShareNames = ['share-data-general'];
const retentionNames = ['retention-general', 'retention-critical'];
const fullNamesArr = doNotShareNames.concat(retentionNames);

const defaultValues = {
    'share-data-general': false,
    'retention-general': 'legal-retention',
    'retention-critical': 'legal-retention'
};
