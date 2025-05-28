import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 16,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
    margin: 16
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 16,
  },
  sectionContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  listItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemIcon: {
    marginRight: 12,
  },
  listItemLabel: {
    fontSize: 17,
  },
  listItemValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemBorder: {
    borderBottomWidth: 0.5,
  },
  valueText: {
    fontSize: 17,
    marginRight: 6,
  },
}); 