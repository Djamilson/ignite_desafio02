import React, { useCallback, useEffect, useState } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

interface IFood {
  id: string;
  image: string;
  name: string;
  price: number;
  description: string;
}

const Dashboard: React.FC = () => {
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const load = useCallback(async () => {
    const response = await api.get("/foods");
    setFoods(response.data);
  }, [setFoods]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAddFood = useCallback(
    async (food) => {
      try {
        const response = await api.post("/foods", {
          ...food,
          available: true,
        });

        setFoods([...foods, response.data]);
      } catch (err) {
        console.log(err);
      }
    },
    [setFoods, foods]
  );

  const handleUpdateFood = useCallback(
    async (food) => {
      try {
        const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
          ...editingFood,
          ...food,
        });

        const foodsUpdated = foods.map((f) =>
          f.id !== foodUpdated.data.id ? f : foodUpdated.data
        );

        setFoods(foodsUpdated);
      } catch (err) {
        console.log(err);
      }
    },
    [setFoods, foods, editingFood]
  );

  const handleDeleteFood = useCallback(
    async (id) => {
      await api.delete(`/foods/${id}`);

      const foodsFiltered = foods.filter((food) => food.id !== id);

      setFoods(foodsFiltered);
    },
    [setFoods, foods]
  );

  const toggleModal = useCallback(() => {
    setModalOpen(!modalOpen);
  }, [setModalOpen, modalOpen]);

  const toggleEditModal = useCallback(() => {
    setEditModalOpen(!editModalOpen);
  }, [setEditModalOpen, editModalOpen]);

  const handleEditFood = useCallback(
    (food) => {
      setEditingFood(food);
      setEditModalOpen(true);
    },
    [setEditingFood, setEditModalOpen]
  );

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
