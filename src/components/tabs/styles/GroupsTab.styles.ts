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
    marginBottom: 32,
    marginTop: 16,
  },
  section: {
    marginBottom: 32,
  },
  balanceCard: {
    padding: 24,
    borderRadius: 12,
    marginBottom: 32,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  balanceSubtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 16,
  },
  listContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    paddingVertical: 12,
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
  listItemTextContainer: {
    marginLeft: 12,
  },
  listItemLabel: {
    fontSize: 17,
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: 13,
  },
  listItemRight: {
    alignItems: 'flex-end',
  },
  listItemAmount: {
    fontSize: 17,
    fontWeight: '600',
  },
  listItemDivider: {
    height: 0.5,
    marginLeft: 64,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 