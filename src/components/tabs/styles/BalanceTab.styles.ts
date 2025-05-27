import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#8e8e93',
  },
  addButton: {
    padding: 8,
  },
  totalCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 34,
    fontWeight: '500',
  },
  listItem: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  listItemLabel: {
    fontSize: 17,
    fontWeight: '500',
  },
  listItemSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  listItemRight: {
    marginLeft: 12,
  },
  listItemAmount: {
    fontSize: 17,
    fontWeight: '500',
  },
});

export default styles;
