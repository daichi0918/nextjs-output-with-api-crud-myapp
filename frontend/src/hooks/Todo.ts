/**
 * TodoTop
 *
 * @packge hooks
 */
import { EventType } from '@/interfaces/Event';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { TodoContext } from '@/contexts/TodoContext';
import axios from 'axios';
import { deleteTodoApi } from '@/apis/todoApi';
export const useTodo = () => {
  /* state定義 */
  const { originalTodoList, setOriginalTodoList } = useContext(TodoContext);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  /* action定義 */
  /**
   * 検索キーワード更新処理
   * @param {*} e
   */
  const handleChangeSearchKeyword: EventType['onChangeInput'] = useCallback(
    (e) => setSearchKeyWord(e.target.value),
    []
  );

  /**
   * 表示用TodoList
   */
  const showTodoList = useMemo(() => {
    return originalTodoList.filter((todo) => {
      const regexp = new RegExp('^' + searchKeyWord, 'i');
      return todo.title.match(regexp);
    });
  }, [searchKeyWord, originalTodoList]);

  /**
   * todoの削除処理
   * @param { number } targetId
   * @param { string } taskName
   */
  const handleDeleteTodoTask = useCallback(
    async (targetId: number, taskName: string) => {
      if (window.confirm(`「${taskName}」を削除していいですか？`)) {
        const deleteTodo = await deleteTodoApi(targetId);

        if (typeof deleteTodo !== 'object') return;
        setOriginalTodoList(
          originalTodoList.filter((todo) => todo.id !== deleteTodo.id)
        );

        console.log(`Todo ID ${targetId} を削除しました`);
      }
    },
    [originalTodoList, setOriginalTodoList]
  );

  return {
    showTodoList,
    searchKeyWord,
    handleDeleteTodoTask,
    handleChangeSearchKeyword,
  };
};
