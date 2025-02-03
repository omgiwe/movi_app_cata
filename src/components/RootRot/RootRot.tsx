import styles from './RootRot.module.scss'

interface RootRotProps {
  name: string
  id: number
}

export const RootRot = ({ id, name }: RootRotProps) => {
  return <div className={styles.rootRot}>RootRot Component</div>
}
